import { Input } from '@/components/ui/input'
import React from 'react'
import { FaRegFaceSmileBeam } from 'react-icons/fa6'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { EmojiPicker, EmojiPickerContent, EmojiPickerFooter, EmojiPickerSearch } from '../reaction/emojiPicker'
import { Button } from '../ui/button'
import { GifPopover } from '@/app/utils/giphy'



const InputComment = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const handleGifSelect = (gif: { url: string }) => {
        alert(`GIF sélectionné: ${gif.url}`);
    };
    return (
        <div className="w-full flex items-center gap-2">
            <Input type='text' placeholder="Ajouter un commentaire..."></Input>
            <Popover onOpenChange={setIsOpen} open={isOpen}>
                <PopoverTrigger asChild>
                    <Button variant={"ghost"} className='p-0'> <FaRegFaceSmileBeam size={30} /></Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-0">
                    <EmojiPicker
                        className="h-[342px]"
                        onEmojiSelect={({ emoji }) => {
                            setIsOpen(false);
                            console.log(emoji);
                        }}
                    >
                        <EmojiPickerSearch />
                        <EmojiPickerContent />
                        <EmojiPickerFooter />
                    </EmojiPicker>
                </PopoverContent>
            </Popover>
            {/* Changer l'api KEY par la votre  */}
            <GifPopover
                apiKey=""
                onSelect={handleGifSelect}
            />
        </div>
    )
}

export default InputComment