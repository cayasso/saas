import clsx from 'clsx'
import NextLink from 'next/link'

const Link = ({ href = '/', className, children, ...props }) => {
  return (
    <NextLink href={href} passHref>
      <a
        className={clsx(
          `link text-primary focus:ring-1 focus:ring-transparent focus:outline-none`,
          className
        )}
        {...props}
      >
        {children}
      </a>
    </NextLink>
  )
}

export default Link
