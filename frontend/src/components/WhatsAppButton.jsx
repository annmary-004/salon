import React from 'react'
import { MessageCircle } from 'lucide-react'

const WhatsAppButton = () => {
  const phoneNumber = '8078035932' // Replace with real number
  const message = 'Hello Salon Luxe! I would like to book a premium appointment.'
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg"
    >
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-black px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none">
        WhatsApp booking
      </div>
      <MessageCircle size={25} />
    </a>
  )
}

export default WhatsAppButton
