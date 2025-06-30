"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ArrowLeft, Check, ChevronRight, ImageIcon, Info, ListChecks, Save, Upload, X } from "lucide-react"

// Mock truck data - in a real app, this would come from a database
const getTruckById = (id: string) => {
  const trucks = [
    {
      id: 1,
      title: "2022 Ford F-150 XLT",
      price: 42999,
      mileage: 15420,
      year: 2022,
      make: "ford",
      model: "f-150",
      trim: "XLT",
      fuelType: "gasoline",
      transmission: "automatic",
      drivetrain: "4wd",
      color: "Oxford White",
      vin: "1FTEW1EP5NKD12345",
      stock: "F22-0123",
      description:
        "This 2022 Ford F-150 XLT is in excellent condition with low mileage. It features the powerful 3.5L EcoBoost V6 engine, 4x4 drivetrain, and comes loaded with features.",
      images: [
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
        "/placeholder.svg?height=600&width=800",
      ],
      features: [
        "SYNC 4 with 12-inch Touchscreen",
        "360-Degree Camera",
        "Pro Power Onboard Generator",
        "Lane-Keeping System",
        "Pre-Collision Assist with Automatic Emergency Braking",
        "Blind Spot Information System",
      ],
    },
    {
      id: 2,
      title: "2021 Ford F-250 Super Duty Lariat",
      price: 56799,
      mileage: 22150,
      year: 2021,
      make: "ford",
      model: "f-250",
      trim: "Lariat",
      fuelType: "diesel",
      transmission: "automatic",
      drivetrain: "4wd",
      color: "Agate Black",
      vin: "1FT7W2BT5MED12345",
      stock: "F21-0456",
      description:
        "This 2021 Ford F-250 Super Duty Lariat is a powerful work truck with the legendary Power Stroke diesel engine.",
      images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
      features: [
        "Power Stroke 6.7L V8 Turbo Diesel",
        "SYNC 4 with 12-inch Touchscreen",
        "Leather-Appointed Seating",
        "Heated and Ventilated Front Seats",
        "Trailer Tow Package",
      ],
    },
  ]

  return trucks.find((truck) => truck.id === Number.parseInt(id))
}

export default function EditTruckPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [activeTab, setActiveTab] = useState("details")
  const [truck, setTruck] = useState<any>(null)
  const [images, setImages] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    year: "",
    make: "ford",
    model: "",
    trim: "",
    mileage: "",
    fuelType: "",
    transmission: "",
    drivetrain: "",
    color: "",
    vin: "",
    stock: "",
    description: "",
  })
  const [formValid, setFormValid] = useState({
    details: true,
    images: true,
    features: true,
  })

  useEffect(() => {
    const truckData = getTruckById(resolvedParams.id)
    if (truckData) {
      setTruck(truckData)
      setFormData({
        title: truckData.title,
        price: truckData.price.toString(),
        year: truckData.year.toString(),
        make: truckData.make,
        model: truckData.model,
        trim: truckData.trim,
        mileage: truckData.mileage.toString(),
        fuelType: truckData.fuelType,
        transmission: truckData.transmission,
        drivetrain: truckData.drivetrain,
        color: truckData.color,
        vin: truckData.vin,
        stock: truckData.stock,
        description: truckData.description,
      })
      setImages(truckData.images || [])
      setFeatures(truckData.features || [])
    }
  }, [resolvedParams.id])

  const validateDetailsTab = () => {
    const valid = formData.title && formData.price && formData.year && formData.model
    setFormValid((prev) => ({ ...prev, details: !!valid }))
    return !!valid
  }

  const validateImagesTab = () => {
    const valid = images.length >= 1
    setFormValid((prev) => ({ ...prev, images: valid }))
    return valid
  }

  const validateFeaturesTab = () => {
    const valid = features.length >= 1
    setFormValid((prev) => ({ ...prev, features: valid }))
    return valid
  }

  const handleTabChange = (value: string) => {
    if (activeTab === "details" && value !== "details") {
      if (!validateDetailsTab()) return
    }
    if (activeTab === "images" && value !== "images") {
      if (!validateImagesTab()) return
    }
    if (activeTab === "features" && value !== "features") {
      if (!validateFeaturesTab()) return
    }
    setActiveTab(value)
  }

  const handleNextTab = () => {
    if (activeTab === "details") {
      if (validateDetailsTab()) setActiveTab("images")
    } else if (activeTab === "images") {
      if (validateImagesTab()) setActiveTab("features")
    } else if (activeTab === "features") {
      if (validateFeaturesTab()) setActiveTab("review")
    }
  }

  const handlePrevTab = () => {
    if (activeTab === "images") setActiveTab("details")
    else if (activeTab === "features") setActiveTab("images")
    else if (activeTab === "review") setActiveTab("features")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddImage = () => {
    setImages([...images, `/placeholder.svg?height=600&width=800&text=Image ${images.length + 1}`])
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    const newFeatures = [...features]
    newFeatures.splice(index, 1)
    setFeatures(newFeatures)
  }

  const handleSubmit = () => {
    // In a real app, this would update the truck in the database
    alert("Truck listing updated successfully!")
    router.push("/admin/inventory")
  }

  if (!truck) {
    return (
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <AdminSidebar activePage="inventory" />
        <div className="flex flex-col">
          <AdminHeader title="Edit Truck" />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Truck Not Found</h2>
              <p className="text-muted-foreground mb-4">The truck you're looking for doesn't exist.</p>
              <Button onClick={() => router.push("/admin/inventory")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Inventory
              </Button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AdminSidebar activePage="inventory" />

      <div className="flex flex-col">
        <AdminHeader title="Edit Truck" />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <Button
              variant="ghost"
              className="flex items-center text-muted-foreground"
              onClick={() => router.push("/admin/inventory")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inventory
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold">Edit Truck Listing</h1>
            <p className="text-muted-foreground">Update the truck listing information, images, and features.</p>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">Basic Details</span>
                <span className="sm:hidden">Details</span>
                {formValid.details && <Check className="h-4 w-4 text-green-500 ml-auto" />}
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Truck Images</span>
                <span className="sm:hidden">Images</span>
                {formValid.images && <Check className="h-4 w-4 text-green-500 ml-auto" />}
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                <span className="hidden sm:inline">Features & Specs</span>
                <span className="sm:hidden">Features</span>
                {formValid.features && <Check className="h-4 w-4 text-green-500 ml-auto" />}
              </TabsTrigger>
              <TabsTrigger value="review" className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Review</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Details</CardTitle>
                  <CardDescription>Update the basic information about the truck.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Truck Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="e.g. 2022 Ford F-150 XLT"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        placeholder="e.g. 42999"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => handleInputChange("year", e.target.value)}
                        placeholder="e.g. 2022"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Select value={formData.make} onValueChange={(value) => handleInputChange("make", value)}>
                        <SelectTrigger id="make">
                          <SelectValue placeholder="Select make" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ford">Ford</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Select value={formData.model} onValueChange={(value) => handleInputChange("model", value)}>
                        <SelectTrigger id="model">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="f-150">F-150</SelectItem>
                          <SelectItem value="f-250">F-250</SelectItem>
                          <SelectItem value="f-350">F-350</SelectItem>
                          <SelectItem value="ranger">Ranger</SelectItem>
                          <SelectItem value="maverick">Maverick</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trim">Trim Level</Label>
                      <Input
                        id="trim"
                        value={formData.trim}
                        onChange={(e) => handleInputChange("trim", e.target.value)}
                        placeholder="e.g. XLT, Lariat, King Ranch"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mileage">Mileage</Label>
                      <Input
                        id="mileage"
                        type="number"
                        value={formData.mileage}
                        onChange={(e) => handleInputChange("mileage", e.target.value)}
                        placeholder="e.g. 15420"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fuel-type">Fuel Type</Label>
                      <Select value={formData.fuelType} onValueChange={(value) => handleInputChange("fuelType", value)}>
                        <SelectTrigger id="fuel-type">
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gasoline">Gasoline</SelectItem>
                          <SelectItem value="diesel">Diesel</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="electric">Electric</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transmission">Transmission</Label>
                      <Select
                        value={formData.transmission}
                        onValueChange={(value) => handleInputChange("transmission", value)}
                      >
                        <SelectTrigger id="transmission">
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="automatic">Automatic</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="drivetrain">Drivetrain</Label>
                      <Select
                        value={formData.drivetrain}
                        onValueChange={(value) => handleInputChange("drivetrain", value)}
                      >
                        <SelectTrigger id="drivetrain">
                          <SelectValue placeholder="Select drivetrain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2wd">2WD</SelectItem>
                          <SelectItem value="4wd">4WD</SelectItem>
                          <SelectItem value="awd">AWD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="color">Exterior Color</Label>
                      <Input
                        id="color"
                        value={formData.color}
                        onChange={(e) => handleInputChange("color", e.target.value)}
                        placeholder="e.g. Oxford White"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vin">VIN</Label>
                      <Input
                        id="vin"
                        value={formData.vin}
                        onChange={(e) => handleInputChange("vin", e.target.value)}
                        placeholder="e.g. 1FTEW1EP5NKD12345"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Number</Label>
                    <Input
                      id="stock"
                      value={formData.stock}
                      onChange={(e) => handleInputChange("stock", e.target.value)}
                      placeholder="e.g. F22-0123"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Provide a detailed description of the truck's condition, features, and any notable details..."
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle>Truck Images</CardTitle>
                  <CardDescription>Update high-quality images of the truck.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload Images</h3>
                    <p className="text-muted-foreground mb-4">Drag and drop images here, or click to select files</p>
                    <Button onClick={handleAddImage}>
                      <Upload className="mr-2 h-4 w-4" />
                      Select Images
                    </Button>
                  </div>

                  {images.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Current Images ({images.length})</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                              </div>
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            {index === 0 && (
                              <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                Main
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Features & Specifications</CardTitle>
                  <CardDescription>Update key features and specifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a feature (e.g. SYNC 4 with 12-inch Touchscreen)"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddFeature()}
                    />
                    <Button onClick={handleAddFeature}>Add</Button>
                  </div>

                  {features.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Current Features ({features.length})</h4>
                      <div className="space-y-2">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted p-3 rounded-lg">
                            <span>{feature}</span>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveFeature(index)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="review">
              <Card>
                <CardHeader>
                  <CardTitle>Review & Update</CardTitle>
                  <CardDescription>Review all changes before updating the truck listing.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium">Basic Details</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">All required fields completed</p>
                    </div>

                    <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium">Images</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{images.length} images uploaded</p>
                    </div>

                    <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Check className="h-5 w-5 text-green-600" />
                        <h4 className="font-medium">Features</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{features.length} features listed</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Update Summary</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>
                        <strong>Title:</strong> {formData.title}
                      </p>
                      <p>
                        <strong>Price:</strong> ${Number.parseInt(formData.price || "0").toLocaleString()}
                      </p>
                      <p>
                        <strong>Year:</strong> {formData.year}
                      </p>
                      <p>
                        <strong>Model:</strong> {formData.model}
                      </p>
                      <p>
                        <strong>Mileage:</strong> {Number.parseInt(formData.mileage || "0").toLocaleString()} miles
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevTab} disabled={activeTab === "details"}>
                Previous
              </Button>

              <div className="flex gap-2">
                {activeTab !== "review" ? (
                  <Button onClick={handleNextTab}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit}>
                    <Save className="mr-2 h-4 w-4" />
                    Update Listing
                  </Button>
                )}
              </div>
            </div>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
