import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { setServers } from 'node:dns'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import { ClaimModel } from '../models/Claim.js'
import { LostFoundItemModel } from '../models/LostFoundItem.js'
import { User } from '../models/User.js'

interface DemoData {
  users: Array<{ id: string; email: string }>
  items: Array<{
    id: string
    title: string
    description: string
    category: string
    status: 'lost' | 'found'
    location: string
    postedByUserId: string
    createdAt: string
  }>
  claims: Array<{
    itemId: string
    claimantUserId: string
    notes: string
    status: 'pending' | 'approved' | 'rejected'
    createdAt: string
  }>
}

const dnsServers = process.env.DNS_SERVERS?.split(',').map((server) => server.trim()).filter(Boolean)
if (dnsServers?.length) setServers(dnsServers)

const demoData = JSON.parse(
  readFileSync(resolve(process.cwd(), '../db.json'), 'utf8'),
) as DemoData

async function seedDemoData() {
  await connectDB()

  const existingUsers = await User.find({
    email: { $in: demoData.users.map((user) => user.email) },
  }).select('_id email')
  const fallbackUser = await User.findOne({ isActive: true }).select('_id')

  if (!fallbackUser) {
    throw new Error('Register an account before seeding demo data.')
  }

  const userIds = new Map(
    demoData.users.map((demoUser) => [
      demoUser.id,
      existingUsers.find((user) => user.email === demoUser.email)?._id ?? fallbackUser._id,
    ]),
  )
  const itemIds = new Map<string, mongoose.Types.ObjectId>()
  let insertedItems = 0
  let insertedClaims = 0

  for (const demoItem of demoData.items) {
    const postedByUserId = userIds.get(demoItem.postedByUserId)
    if (!postedByUserId) {
      throw new Error(`No user mapping for demo user ${demoItem.postedByUserId}.`)
    }

    let item = await LostFoundItemModel.findOne({
      title: demoItem.title,
      location: demoItem.location,
      postedByUserId,
    })

    if (!item) {
      item = await LostFoundItemModel.create({
        title: demoItem.title,
        description: demoItem.description,
        category: demoItem.category,
        status: demoItem.status,
        location: demoItem.location,
        postedByUserId,
        createdAt: new Date(demoItem.createdAt),
      })
      insertedItems += 1
    }

    itemIds.set(demoItem.id, item._id)
  }

  for (const demoClaim of demoData.claims) {
    const itemId = itemIds.get(demoClaim.itemId)
    const claimantUserId = userIds.get(demoClaim.claimantUserId)
    if (!itemId || !claimantUserId) {
      throw new Error(`Could not resolve demo claim references for item ${demoClaim.itemId}.`)
    }

    const existingClaim = await ClaimModel.findOne({
      itemId,
      claimantUserId,
      notes: demoClaim.notes,
    })
    if (existingClaim) continue

    await ClaimModel.create({
      itemId,
      claimantUserId,
      notes: demoClaim.notes,
      status: demoClaim.status,
      createdAt: new Date(demoClaim.createdAt),
    })
    insertedClaims += 1
  }

  console.log(`Demo data added: ${insertedItems} items, ${insertedClaims} claims.`)
  console.log('Demo records use existing MongoDB users; no passwords or users were created.')
}

seedDemoData()
  .catch((error: unknown) => {
    console.error('Could not seed demo data:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })