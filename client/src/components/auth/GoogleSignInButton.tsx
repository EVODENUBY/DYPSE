
import { FaGoogle } from 'react-icons/fa';
import { googleButton } from '@/theme';

interface GoogleSignInButtonProps {
  onClick?: () => void;
  text?: string;
  className?: string;
}

export function GoogleSignInButton({ 
  onClick = () => console.log('Google sign in clicked'),
  text = 'Sign up with Google',
  className = ''
}: GoogleSignInButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${googleButton} ${className}`}
    >
      <FaGoogle className="w-5 h-5 mr-3" />
      <span className="text-base">{text}</span>
    </button>
  );
}
