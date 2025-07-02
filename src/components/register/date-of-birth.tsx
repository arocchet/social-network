"use client"

import { format } from "date-fns"
import { FaBirthdayCake } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Form
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUserForm } from "@/app/context/user-register-form-context"

const FormSchema = z.object({
    dob: z.date({
        required_error: "Une date de naissance est requise.",
    }),
})

/**
 * @deprecated This component has been inlined into <RegisterForm />.
 * @todo Maybe delete this file if it's no longer used anywhere.
 */
export function DateOfBirth() {
    const { handleChange } = useUserForm()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            dob: undefined,
        },
    })

    return (
        <Form {...form}>
            <div className="space-y-8">
                <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date of Birth</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"ghost"}
                                            className="pl-3 text-left font-normal border-1 border-[var(--detailMinimal)]"
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Select a date</span>
                                            )}
                                            <FaBirthdayCake className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={(date) => {
                                            field.onChange(date)
                                            if (date) {
                                                const formatted = format(date, "yyyy-MM-dd");
                                                handleChange({
                                                    target: {
                                                        id: "dateOfBirth",
                                                        value: formatted,
                                                    },
                                                } as React.ChangeEvent<HTMLInputElement>);
                                            }
                                        }}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </Form>
    )
}
