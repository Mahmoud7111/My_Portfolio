import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

/**
 * StaggerReveal — wraps children in a stagger container.
 * Each *direct* child gets the item variant applied automatically.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]  forwarded to the container div
 * @param {number} [props.stagger=0.07]  seconds between each child animation
 * @param {number} [props.delay=0.1]  initial delay before first child animates
 * @param {number|string} [props.amount=0.2]  IntersectionObserver threshold
 */
export default function StaggerReveal({
  children,
  className,
  style,
  stagger = 0.07,
  delay = 0.1,
  amount = 0.2,
}) {
  const prefersReduced = usePrefersReducedMotion()

  if (prefersReduced) return <div className={className} style={style}>{children}</div>

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  }

  return (
    <motion.div
      className={className}
      style={style}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  )
}

/**
 * StaggerItem — must be a direct child of StaggerReveal.
 */
export function StaggerItem({ children, className }) {
  const prefersReduced = usePrefersReducedMotion()
  if (prefersReduced) return <div className={className}>{children}</div>

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
}
