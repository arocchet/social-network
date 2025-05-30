/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Card } from '../ui/card'

const CommentPage = () => {
    return (
        <div>
            <div className='px-4 py-4'>Ceci est le contenu text du comment</div>
            <div className="px-4">
                <Card className="border-none bg-transparent p-0 shadow-none relative overflow-hidden rounded-xl inline-block">
                    <img
                        src="https://i.pinimg.com/736x/94/24/5c/94245c244df58da6b779e2338b8c7b59.jpg"
                        alt="Background"
                        className="w-full h-auto object-cover block rounded-3xl"
                    />
                </Card>
            </div>
        </div>

    )
}

export default CommentPage
