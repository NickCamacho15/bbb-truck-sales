import { HeroSection } from "@/components/hero-section";
import FeaturedTrucks from "@/components/featured-trucks";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <section className="container mx-auto py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Trucks for Sale</h2>
        <FeaturedTrucks />
      </section>
      <section className="bg-gray-50 py-16 dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-700">
              <h3 className="text-xl font-bold mb-4">Quality Used Trucks</h3>
              <p className="text-gray-600 dark:text-white">
                We offer a wide selection of thoroughly inspected and quality used trucks. Every vehicle goes through a comprehensive inspection process.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-700">
              <h3 className="text-xl font-bold mb-4">Professional Service</h3>
              <p className="text-gray-600 dark:text-white">
                Our knowledgeable staff can help you find the perfect truck for your needs. We provide expert guidance through every step of the purchase process.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-700">
              <h3 className="text-xl font-bold mb-4">Customer Satisfaction</h3>
              <p className="text-gray-600 dark:text-white">
                Our team is dedicated to providing exceptional customer service. We're not satisfied until you drive away happy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
