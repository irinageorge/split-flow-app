import { useEffect, useId, useState } from "react"
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
import { CheckCircle, Loader2, } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
                    setOpen(false)
                    reset();
                },
                onError: () => {
                    setOpen(false);
                    setEmail("");
                    setPassword("");
                },
            }
        );
    };

    useEffect(() => {
        if (!error) return;
        const t = setTimeout(() => reset(), 5000);
        return () => clearTimeout(t);
    }, [error]);

    return (
        <>
            {error?.message && (
                <Alert className="text-green-700 bg-green-50 border-green-200 [&>svg]:text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="!text-green-700/90">
                        You were successfully logged in
                    </AlertDescription>
                </Alert>
            )}

            <Dialog open={open}
                onOpenChange={(v) => {
                    setOpen(v);
                    if (v && error) reset();
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