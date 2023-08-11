
export const Personality = {
    Tiffany: 'valley girl',
    Sky: 'hippie',
    Chad: 'jock',
    Luna: 'goth',
    Sam: 'Samuel L. Jackson',
    Kai: 'beach bum',
    Felix: 'hipster',
    Steve: 'metalhead',
    // Quinn: 'skater',
    Sophia: 'fashionista',
    Emma: 'foodie',
    Brody: 'fitness enthusiast',
    Navin: 'jerk',
} as const;

export type Personality = (typeof Personality)[keyof typeof Personality];

export const Mood = {
    Sarcastic: 'sarcastic',
    Angry: 'pissed off',
    Disappointed: 'disappointed',
    Happy: 'ecstatic',
    // Scared: 'scared',
    // Lonely: 'lonely',
    None: '',
} as const;

export type Mood = (typeof Mood)[keyof typeof Mood];

export const ResponseLength = {
    Short: '1-2 sentences',
    Medium: '2-3 sentences',
    Long: '3-4 sentences'

} as const;

export type ResponseLength = (typeof ResponseLength)[keyof typeof ResponseLength];

export const Relationship = {
    Stranger: 'stranger',
    Acquaintance: 'acquaintance',
    // Friend: 'friend',
    Enemy: 'enemy',
    Nemesis: 'nemesis',
} as const;

export type Relationship = (typeof Relationship)[keyof typeof Relationship];