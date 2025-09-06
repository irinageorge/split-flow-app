import { useId } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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


export default function SignIn() {
    const id = useId()
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="brand">Log in</Button>
            </DialogTrigger>
            <DialogContent>
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="flex size-11 shrink-0 items-center justify-center rounded-full border"
                        aria-hidden="true"
                    >
                        <img src={appIcon} alt="app icon" className="w-5 h-5" />
                        <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />

                    </div>
                    <DialogHeader>
                        <DialogTitle className="sm:text-center">Welcome back to SplitFlow</DialogTitle>
                        <DialogDescription className="sm:text-center">
                            Enter your credentials to login to your account.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form className="space-y-5">
                    <div className="space-y-4">
                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-email`}>Email</Label>
                            <Input
                                id={`${id}-email`}
                                placeholder="john@doe.com"
                                type="email"
                                required
                            />
                        </div>
                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-password`}>Password</Label>
                            <Input
                                id={`${id}-password`}
                                placeholder="Enter your password"
                                type="password"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Checkbox id={`${id}-remember`} />
                            <Label
                                htmlFor={`${id}-remember`}
                                className="text-muted-foreground font-normal"
                            >
                                Remember me
                            </Label>
                        </div>
                        <a className="text-sm underline hover:no-underline" href="#">
                            Forgot password?
                        </a>
                    </div>
                    <Button type="button" className="w-full">
                        Sign in
                    </Button>
                </form>
            </DialogContent>
        </Dialog >
    )
}
