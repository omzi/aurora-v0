import React from 'react';
import Loader from 'react-ts-loaders';

export interface AuthSocialButtonProps {
  loading: boolean;
	text: string;
	icon: React.ReactNode | string;
	onClick: () => void;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
	loading,
	text,
	icon,
	onClick
}) => {
	const isSVGString = typeof icon === 'string' && icon.startsWith('<svg');

  return (
    <div>
			<button type='button' disabled={loading} onClick={onClick} className="inline-flex justify-center w-full px-4 py-2 text-gray-500 bg-white hover:bg-gray-50 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 disabled:bg-gray-200 disabled:hover:bg-gray-200 focus:outline-offset-0">
				{loading ? <Loader size={24} className='leading-[0] text-black' /> : (
					<>
						<span className="sr-only">{text}</span>
						{isSVGString ? (
							<div dangerouslySetInnerHTML={{ __html: icon as string }} />
						) : (
							icon
						)}
					</>
				)}
			</button>
		</div>
  );
};

export default AuthSocialButton;
