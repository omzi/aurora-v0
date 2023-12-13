import Image from 'next/image';

import React from 'react';
import { CalendarCheck } from 'lucide-react';

import { Button } from '../ui/button';

import DummyDashboard from './utils/DummyDashboard';

const Schedule = () => {
	return (
		<section className="grid gap-5 grid-cols-1 lg:grid-cols-2">
			<div className="flex flex-col items-start gap-3">
				<div className="relative w-[100px] h-[100px] mt-5">
					<Image
						src="/images/logo.png"
						fill
						className="object-contain"
						alt="logo"
					/>
				</div>
				<h4 className="font-clash-display-bold mt-5 text-left text-4xl sm:text-5xl md:text-6xl font-semibold">
					Solutions for Every Business
				</h4>
				<p className="text-xl text-left mt-5">
					Expand your customer base, streamline invoicing, and effortlessly
					manage payments and withdrawals with Aurora – your trusted tech
					partner in payment solutions.
				</p>
				<Button className="mt-5">
					<CalendarCheck className="h-4 w-4 mr-2" />
					Schedule a demo
				</Button>
			</div>
			<DummyDashboard />
		</section>
	);
};

export default Schedule;
