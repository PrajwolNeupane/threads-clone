"use client"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { UserValidation } from '@/lib/validations/user';
import * as z from 'zod';
import { Button } from "../ui/button";
import Image from "next/image";
import { ChangeEvent } from "react";
import { Textarea } from "../ui/textarea";

interface Props {
    user: {
        id: string,
        username: string,
        name: string,
        bio: string,
        image: string
    },
    btnTitle: string
}


const AccountProfile = ({ user, btnTitle }: Props) => {

    const form = useForm({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_photo: "",
            name: "",
            username: "",
            bio: ""
        }
    })

    function onHandleImage(e: ChangeEvent, fieldChange: (value: string) => void) {
        e.preventDefault();
    }

    function onSubmit(values: z.infer<typeof UserValidation>) {
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10 justify-start">
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                            <FormLabel className="account-form_image-label">{
                                field.value ? (
                                    <Image src={field.value} alt="Profile Photo" width={96} height={96} priority className="rounded-full object-contain" />
                                ) : <Image src={"/assets/profile.svg"} alt="Profile Photo" width={24} height={24} className="object-contain" />
                            }</FormLabel>
                            <FormControl className="flex-1 text-base-semibold text-gray-100">
                                <Input type="file" accept="image/*" placeholder="Upload a photo" className="account-form_image-input" onChange={(e) => {
                                    onHandleImage(e, field.onChange);
                                }} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-2">Name</FormLabel>
                            <FormControl className="flex-1 text-base-semibold text-gray-100">
                                <Input placeholder="Joe Doe" className="account-form_input no-focus" type="text" />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-2">Username</FormLabel>
                            <FormControl className="flex-1 text-base-semibold text-gray-100">
                                <Input placeholder="Joe Doe" className="account-form_input no-focus" type="text" />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-2">Bio</FormLabel>
                            <FormControl className="flex-1 text-base-semibold text-gray-100">
                                <Textarea rows={5} className="account-form_input no-focus" placeholder="Hi I am,..." />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" className="bg-primary-500">Submit</Button>
            </form>
        </Form>
    )
}

export default AccountProfile;