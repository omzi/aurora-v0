const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="m-6 flex items-center justify-center">
			{children}
		</div>
	)
}

export default AuthLayout;
