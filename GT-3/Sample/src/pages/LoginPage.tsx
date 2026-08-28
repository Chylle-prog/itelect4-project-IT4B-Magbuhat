// src/pages/LoginPage.tsx -- NEW FILE
import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
function LoginPage() {
const [name, setName] = useState<string>("");
// Pull just the login action out of the store
const login = useAuthStore((state) => state.login);
const navigate = useNavigate();
const handleLogin = (): void => {
login(name); // 1. put the token in the store
navigate("/submissions"); // 2. then send them where they were going
};
return (
<div className="max-w-sm">
<h2 className="mb-4 text-2xl font-bold text-gray-900
dark:text-white">Login</h2>
<Label htmlFor="name" className="text-foreground">Your Name</Label>
<Input id="name" value={name} onChange={(e) => setName(e.target.value)}
placeholder="Enter your name" />
<Button onClick={handleLogin} disabled={!name.trim()} className="mt-3 justify-self-start">
Log In
</Button>
</div>
);
}
export default LoginPage;