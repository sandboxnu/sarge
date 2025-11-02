'use client';

import { useAuth } from '@/lib/auth/auth-client';
import useFileUpload from '@/lib/hooks/useFileUpload';
import Image from 'next/image';
import WelcomeModal from './modal';
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/lib/components/Modal"
import { SquarePen } from 'lucide-react';
import { Button } from '@/lib/components/Button';

export default function DashboardPage() {
    const auth = useAuth();
    const { handleFileChange, loading, error, submitted, imageUrl } = useFileUpload('user');

    const showWelcomeModal = auth.user?.orgId === null || auth.user?.orgId === undefined;

    if (!auth.isPending && auth.user) {
        return (
            <div>
                {showWelcomeModal && <WelcomeModal />}
                <Dialog open={true}>
                    <DialogHeader className='sr-only'>Modal</DialogHeader>
                    <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
                        <div className='flex flex-col justify-center'>
                            <h1 className='font-bold'>Create an organization</h1>
                            <div className='flex mt-4 mb-2 content-center justify-center w-full'>
                                <div className="w-[65px] h-[65px] rounded-full bg-sarge-gray-200 flex justify-center items-center">
                                    <SquarePen className='text-sarge-gray-500' />
                                </div>
                            </div>
                            <div className='pt-2 pb-1 font-bold'>Organization name</div>
                            <input
                                type="text"
                                name="Enter a name for your organization"
                                id="Name"
                                className={`bg-sarge-gray-50 text-sarge-gray-800 placeholder:text-sarge-gray-500 border-sarge-gray-200 rounded-lg border px-3 py-1 h-[44px]`}
                                placeholder="Enter a name for your organization"
                            />
                            <div className='justify-between flex mt-4 items-center'>
                                {/*TODO: make this a back button*/}
                                <p className='text-sarge-primary-700'>Back</p>
                                <Button variant='primary' size='default' className='w-[125px]'>Continue</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="">{auth.user.name}</div>

                {/* THIS IS A SAMPLE OF HOW IMAGE UPLOAD WORKS FOR USERS / PLEASE REMOVE BEFORE WORKING ON THIS PAGE */}
                <input
                    id="upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="mt-2"
                />

                {loading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                {submitted && !error && !loading && (
                    <p className="mt-2 text-sm text-green-600">Success!</p>
                )}

                {imageUrl && <Image src={imageUrl} height={50} width={50} alt="image" />}
            </div>
        );
    } else {
        return <div className="">Loading...</div>;
    }
}
