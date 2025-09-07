import { useId, useState } from "react"
import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
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
import { useLogin } from "@/services/LoginPageQuery"
import { Loader2 } from "lucide-react"

export default function SignIn() {
    const id = useId();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(false);

    const { mutateAsync: login, isPending, error, reset } = useLogin();

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        reset();
        login(
            { email, password },
            {
                onSuccess: (resp) => {
                    console.log("Login response:", resp);
                },
                onError: () => {
                    setPassword("");
                    setEmail("");
                },
            }
        );
    };

    return (
        <>
            <Dialog open={open}
                onOpenChange={(v) => {
                    setOpen(v);
                    if (!v) {
                        reset();
                        setEmail("");
                        setPassword("");
                    }
                }}>

                <DialogTrigger asChild>
                    <Button variant="brand">Log in</Button>
                </DialogTrigger>

                <DialogContent>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
                            <img src={appIcon} alt="app icon" className="w-5 h-5" />
                        </div>
                        <DialogHeader>
                            <DialogTitle className="sm:text-center">Welcome back to SplitFlow</DialogTitle>
                            <DialogDescription className="sm:text-center">
                                Enter your credentials to login to your account.
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div role="status" aria-live="polite" className="min-h-6 text-sm">
                        {error instanceof Error && (
                            <p className="mt-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-700 text-center">
                                {error.message}
                            </p>
                        )}
                    </div>

                    <form className="space-y-5" onSubmit={handleFormSubmit}>
                        <div className="space-y-4">
                            <div className="*:not-first:mt-2">
                                <Label htmlFor={`${id}-email`}>Email</Label>
                                <Input
                                    id={`${id}-email`}
                                    placeholder="john@doe.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    required
                                />
                            </div>
                            <div className="*:not-first:mt-2">
                                <Label htmlFor={`${id}-password`}>Password</Label>
                                <Input
                                    id={`${id}-password`}
                                    placeholder="Enter your password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        {isPending ? (
                            <Button className="w-full" disabled aria-busy>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full">
                                Sign in
                            </Button>
                        )}
                    </form>
                </DialogContent>
            </Dialog >
        </>
    );
}