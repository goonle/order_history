import { describe, it, expect, vi, type Mock } from 'vitest'
import { changeUserPassword } from './auth.service'
import { getAuthedUserIdFromSessionToken } from './session.service'
import { findUserById, changeUserPasswordInRepo } from '@/server/repositories/auth.repo'
import * as authRepo from '@/server/repositories/auth.repo'
import { changePasswordAction } from '../actions/auth.action'
import bcrypt from 'bcryptjs'

vi.mock('@/server/repositories/auth.repo')
vi.mock('./session.service')
vi.mock('bcryptjs')

describe('changeUserPassword', () => {
    // case 1
    it.each([
        { field: 'currentPassword', payload: { currentPassword: '', newPassword: 'new123', confirmPassword: 'new123' } },
        { field: 'newPassword', payload: { currentPassword: 'old123', newPassword: '', confirmPassword: 'new123' } },
        { field: 'confirmPassword', payload: { currentPassword: 'old123', newPassword: 'new123', confirmPassword: '' } },
    ])('if $field is empty, error occurs', async ({ payload }) => {
        await expect(changePasswordAction(payload)).rejects.toThrow("password are required.")
    })

    // case 2
    const wrongPayload = {
        currentPassword: 'old123',
        newPassword: 'new123',
        confirmPassword: 'different123'
    }

    it('If the new password and confirmPassword are diffrent, error occurs', async () => {
        await expect(
            changeUserPassword(wrongPayload)
        ).rejects.toThrow('do not match')
    })

    // case 3
    const validPayload = {
        currentPassword: 'old123',
        newPassword: 'new123',
        confirmPassword: 'new123'
    }

    it("if there isn't session info, error occurs", async () => {
        // doesn't have session info
        vi.mocked(getAuthedUserIdFromSessionToken).mockResolvedValue(null)
        await expect(changePasswordAction)
            .rejects.toThrow('User not authenticated')
    })

    // case 4
    it("if there is session info, but the database doesn't have userId then error occurs", async () => {
        // has session info
        vi.mocked(getAuthedUserIdFromSessionToken).mockResolvedValue(1)
        // couldn't find it from database
        vi.mocked(findUserById).mockResolvedValue(null)

        await expect(changeUserPassword(validPayload))
            .rejects.toThrow('User not found')
    })

    // case 5
    it("if currentPassword isn't matched with encryptedPassword in database, error occurs", async () => {
        // has session info
        vi.mocked(getAuthedUserIdFromSessionToken).mockResolvedValue(1)
        // find it from database
        vi.mocked(findUserById).mockResolvedValue({
            id: 1,
            accountId: 'test-user',
            passwordEncrypted: 'hashed-value', 
        })
        // when the password and passwordEncrypted are different
        vi.mocked(bcrypt.compare as Mock).mockResolvedValue(false)
        
        await expect(changeUserPassword(validPayload))
            .rejects.toThrow('User not found')
    })


})