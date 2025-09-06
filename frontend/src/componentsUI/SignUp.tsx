import { useId } from "react"
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

export default function SignUp() {
    const id = useId()
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">Sign up</Button>
            </DialogTrigger>
            <DialogContent>
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="flex size-11 shrink-0 items-center justify-center rounded-full border"
                        aria-hidden="true"
                    >
                        <img src={appIcon} alt="app icon" className="w-5 h-5" />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="sm:text-center">
                            Join SplitFlow
                        </DialogTitle>
                        <DialogDescription className="sm:text-center">
                            We just need a few details to get you started.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form className="space-y-5">
                    <div className="space-y-4">
                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-name`}>Full name</Label>
                            <Input
                                id={`${id}-name`}
                                placeholder="John Doe"
                                type="text"
                                required
                            />
                        </div>
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
                    <Button type="button" className="w-full">
                        Sign up
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
