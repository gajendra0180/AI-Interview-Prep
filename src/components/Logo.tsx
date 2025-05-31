import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  className?: string;
};

const Logo = ({ className = '' }: LogoProps) => {
  return (
    <Link href="/dashboard" className={`flex items-center ${className}`}>
      <img 
        src="https://i.ibb.co/FFDCZ3q/websitelogo.png" 
        alt="Interview Prep" 
        width={80} 
        height={80}
        className="rounded-md"
      />
      <span className="ml-2 font-bold text-[#123f70] text-3xl font-roboto mt-[10px]">Interview Prep</span>
    </Link>
  );
};

export default Logo; 