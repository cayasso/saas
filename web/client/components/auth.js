import { useForm } from 'react-hook-form'
import { InboxArrowDownIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from 'client/hooks'
import Link from 'client/components/link'
import i18n from 'shared/lib/i18n'

const Auth = () => {
  const { email, signin, verifying, cancel, expired } = useAuth()
  const { register, handleSubmit } = useForm({ defaultValues: { email: '' } })

  return verifying ? (
    <div className='card py-6 shadow-2xl w-full max-w-sm bg-white'>
      <div className='card-body text-center antialiased'>
        <div className='flex justify-center'>
          <InboxArrowDownIcon
            strokeWidth={1}
            className='w-20 h-20 text-primary'
          />
        </div>
        <p className='font-semibold text-2xl mb-4'>Check your email</p>
        <p>We emailed a magic link to:</p>
        <p className='font-bold'>{email}</p>
        <p>Click the link to login or signup.</p>

        <div>
          <button
            onClick={cancel}
            className='btn btn-ghost hover:bg-primary/5 inline-block text-primary mt-4'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className='py-6 px-4 card shadow-2xl w-full max-w-sm bg-white'>
      <form
        onSubmit={handleSubmit(signin)}
        className='card-body flex items-center justify-center gap-6 aliased'
      >
        <div className='flex justify-center'>
          <UserCircleIcon strokeWidth={1} className='w-20 h-20 text-primary' />
        </div>
        <p className='font-semibold text-2xl'>Login or Signup</p>

        {expired && (
          <p className='text-error text-center'>{i18n`Verification expired`}</p>
        )}

        <input
          type='email'
          placeholder='email'
          className='input input-outlined input-primary w-full'
          {...register('email', {
            required: 'Required',
          })}
        />

        <input
          value='Continue'
          type='submit'
          className='btn btn-primary w-full'
        />

        {!verifying && (
          <small className='text-sm text-center w-full block'>
            {i18n`By continuing you agree to our`} <br />
            <Link rel='noopener' target='_blank' href='/terms'>
              {i18n`Terms of Use`}
            </Link>{' '}
            {i18n`and`}{' '}
            <Link rel='noopener' target='_blank' href='/privacy'>
              {i18n`Privacy Policy`}
            </Link>
            .
          </small>
        )}
      </form>
    </div>
  )
}

export default Auth
