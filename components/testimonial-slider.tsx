"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "John Smith",
    location: "Dallas, TX",
    quote:
      "BBB Truck Sales made buying my F-150 a breeze. Their knowledge of Ford trucks is impressive, and they helped me find exactly what I needed for my construction business.",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    location: "Houston, TX",
    quote:
      "I was hesitant about buying a used truck, but the team at BBB Truck Sales put my worries to rest. My F-250 was in perfect condition and priced fairly.",
  },
  {
    id: 3,
    name: "Mike Williams",
    location: "Austin, TX",
    quote:
      "The customer service at BBB Truck Sales is outstanding. They followed up after my purchase to make sure everything was going well with my new Ranger.",
  },
]

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
              <Card className="border-none shadow-md">
                <CardContent className="pt-6 px-6 pb-8 text-center">
                  <Quote className="h-8 w-8 mx-auto mb-4 text-blue-600" />
                  <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-200">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-6 gap-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 rounded-full ${index === currentIndex ? "bg-blue-600" : "bg-gray-300"}`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
