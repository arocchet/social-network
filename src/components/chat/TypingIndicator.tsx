'use client';

interface TypingUser {
    userId: string;
    username: string;
    firstName?: string;
    lastName?: string;
}

interface TypingIndicatorProps {
    typingUsers: Set<string>;
    typingUsersData?: Map<string, TypingUser>;
    className?: string;
}

export function TypingIndicator({ typingUsers, typingUsersData, className = '' }: TypingIndicatorProps) {
    if (typingUsers.size === 0) {
        return null;
    }

    const userCount = typingUsers.size;
    const userNames = Array.from(typingUsers).map(userId => {
        const userData = typingUsersData?.get(userId);
        if (userData?.firstName && userData?.lastName) {
            return `${userData.firstName} ${userData.lastName}`;
        }
        return userData?.username || 'Utilisateur';
    });

    let displayText = '';
    if (userCount === 1) {
        displayText = `${userNames[0]} est en train d'écrire`;
    } else if (userCount === 2) {
        displayText = `${userNames[0]} et ${userNames[1]} sont en train d'écrire`;
    } else {
        displayText = `${userNames[0]} et ${userCount - 1} autres sont en train d'écrire`;
    }

    return (
        <div className={`flex items-center gap-3 px-4 py-2 text-sm text-gray-500 animate-fade-in ${className}`}>
            <div className="flex items-center gap-1">
                <div className="typing-dots flex space-x-1">
                    <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
            </div>
            <span className="italic">{displayText}...</span>
        </div>
    );
}