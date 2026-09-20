import React from 'react'

const Footer = () => {
    return (

        <div>
            <hr className="border-gray-200" />
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-10 text-sm text-left'>


                <div>
                    <p className="text-xl font-medium mb-5">Help</p>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <li>Returns</li>
                        <li>Delivery Information</li>
                        <li>Contact Us</li>

                    </ul>
                </div>
                <div>
                    <p className="text-xl font-medium mb-5">Company</p>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <li>About Nike</li>
                        <li>News</li>
                        <li>Privacy Policy</li>
                        <li>Terms & Conditions</li>

                    </ul>
                </div>
            </div>
            <div className="py-10">

                <p className="text-gray-500">
                    © 2026 Nike In. All rights reserved.
                </p>
            </div>
        </div>
    )
}

export default Footer