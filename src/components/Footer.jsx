import React from 'react'
import { Link } from "react-router-dom"

const Footer = () => {
    return (

        <div>
            <hr className="border-gray-200" />
            <div className='flex flex-col sm:grid grid-cols-3 gap-14 my-10 mt-10 text-sm text-left'>

                <div>
                    <p className="text-xl font-medium mb-5">Follow Us</p>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <li>FB</li>
                        <li>Insta</li>
                        <li>Tiktok</li>

                    </ul>
                </div>

                <div>
                    <p className="text-xl font-medium mb-5">Help</p>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <li>Returns</li>
                        <li>Delivery Information</li>
                        <li>
                            <Link to="/contact">Contact Us</Link>
                        </li>

                    </ul>
                </div>
                <div>
                    <p className="text-xl font-medium mb-5">Company</p>
                    <ul className="flex flex-col gap-1 text-gray-600">
                        <li>
                            <Link to="/about">About Nike</Link>
                        </li>
                        <li>News</li>
                        <li>Privacy Policy</li>
                        <li>Terms & Conditions</li>

                    </ul>
                </div>
            </div>
            <div className="py-10">

                <p className="text-gray-500">
                    © 2026 Nike Inc. All rights reserved.
                </p>
            </div>
        </div>
    )
}

export default Footer