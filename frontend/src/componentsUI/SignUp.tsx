import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import appIcon from "../assets/split.svg"
import { useSignUp } from "@/services/useSignUp"
import { Loader2 } from "lucide-react"

export default function SignUp() {
    const id = useId();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { mutate: signUp, isPending, isSuccess, error } = useSignUp();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        signUp({ username, email, password }, {
            onSuccess: (resp) => {
                console.log("Sign up response:", resp);
            },
            onError: () => {
            },
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="brand">Sign up</Button>
            </DialogTrigger>

            <DialogContent>
                <div className="flex flex-col items-center gap-2">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
                        <img src={appIcon} alt="app icon" className="w-5 h-5" />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="sm:text-center">Join SplitFlow</DialogTitle>
                        <DialogDescription className="sm:text-center">
                            We just need a few details to get you started.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div role="status" aria-live="polite" className="min-h-6 text-sm">
                    {error instanceof Error && (
                        <p className="mt-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-700 text-center">
                            {error.message}
                        </p>
                    )}
                    {isSuccess && (
                        <p className="mt-2 rounded-md border border-green-300 bg-green-50 px-3 py-2 text-green-700 text-center">
                            Account created successfully!
                        </p>
                    )}
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-name`}>Username</Label>
                            <Input
                                id={`${id}-name`}
                                placeholder="John Doe"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                            />
                        </div>

                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-email`}>Email</Label>
                            <Input
                                id={`${id}-email`}
                                placeholder="john@doe.com"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                            />
                        </div>

                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-password`}>Password</Label>
                            <Input
                                id={`${id}-password`}
                                placeholder="Enter your password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    {isPending ? (
                        <Button className="w-full" disabled aria-busy>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full">
                            Sign in
                        </Button>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
