import Image from 'next/image';

const Images = () => {
	return (
		<div className='flex flex-col items-center justify-center max-w-5xl my-10'>
			<div className='flex items-center'>
				<div className='relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] '>
					<Image
						src='/images/collaboration.png'
						fill
						className='object-contain'
						alt='Collaboration'
					/>
				</div>
			</div>
		</div>
	)
}

export default Images;
