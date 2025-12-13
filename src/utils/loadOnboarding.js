import { getOnboarding } from '@/api/onboarding.api'

export async function loadOnboardingData(onboardingId) {
    if (!onboardingId) {
        throw new Error('Onboarding ID not found')
    }

    const res = await getOnboarding(onboardingId)
    return res.data.data
}
