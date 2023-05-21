import { User } from "@prisma/client";
import Image from "next/image";

interface ProfileImageProps {
    user: User | null,
    width: number,
    height: number,
    className: string,
    defaultImageClass: string
}

export function ProfileImage({ user, width, height, className, defaultImageClass }: ProfileImageProps) {
    if (user) {
        return <Image
            className={className}
            src={`${user.image}`}
            alt='profile image'
            width={width}
            height={height} />
    }

    return <div className={className}>
        <svg xmlns="http://www.w3.org/2000/svg" className={defaultImageClass} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
}