import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function InsuranceLogo() {
  return (
    <div className="flex items-center justify-center text-white">
      <ShieldCheckIcon className="h-12 w-12 transform rotate-15" />
      <p className={`${lusitana.className} text-3xl ml-2 font-bold`}>CodeCrafts</p>
    </div>
  );
}
