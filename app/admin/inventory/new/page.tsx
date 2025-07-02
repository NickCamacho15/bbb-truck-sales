"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHeader } from "@/components/admin-header"
import { ArrowLeft, Check, ChevronRight, ImageIcon, Info, ListChecks, Save, Upload, X, Plus } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

export default function NewTruckPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("details")
  const [images, setImages] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formValid, setFormValid] = useState({
    details: false,
    images: false,
    features: false,
  })

  // Form data state for validation
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    year: "",
    make: "",
    model: "",
    trim: "",
    mileage: "",
    fuelType: "",
    transmission: "",
    drivetrain: "",
    color: "",
    vin: "",
    stockNumber: "",
    description: ""
  })

  // Feature suggestions organized by category
  const featureSuggestions = {
    Technology: [
      "SYNC 4 Infotainment System",
      "360-Degree Camera",
      "Wireless Phone Charging",
      "Apple CarPlay/Android Auto"
    ],
    Safety: [
      "Pre-Collision Assist",
      "Blind Spot Monitoring", 
      "Lane-Keeping System",
      "Adaptive Cruise Control"
    ],
    Comfort: [
      "Heated/Cooled Seats",
      "Dual-Zone Climate Control",
      "Power-Adjustable Seats",
      "Remote Start"
    ],
    Capability: [
      "Pro Power Onboard",
      "Trailer Tow Package",
      "Bed Liner",
      "Running Boards"
    ]
  }

  // Form validation
  const validateDetailsTab = () => {
    const requiredFields = ['title', 'price', 'year', 'make', 'model', 'trim', 'mileage', 'fuelType', 'transmission', 'drivetrain', 'color', 'vin', 'stockNumber', 'description']
    const isValid = requiredFields.every(field => formData[field as keyof typeof formData]?.toString().trim() !== "")
    setFormValid((prev) => ({ ...prev, details: isValid }))
    return isValid
  }

  const validateImagesTab = () => {
    // Require at least 3 images
    const valid = images.length >= 3
    setFormValid((prev) => ({ ...prev, images: valid }))
    return valid
  }

  const validateFeaturesTab = () => {
    // Require at least 3 features
    const valid = features.length >= 3
    setFormValid((prev) => ({ ...prev, features: valid }))
    return valid
  }

  const handleTabChange = (value: string) => {
    // Validate current tab before switching
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
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImagesChange = (newImages: string[]) => {
    setImages(newImages)
  }

  const handleAddFeature = (feature?: string) => {
    const featureToAdd = feature || newFeature.trim()
    if (featureToAdd && !features.includes(featureToAdd)) {
      setFeatures([...features, featureToAdd])
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    const newFeatures = [...features]
    newFeatures.splice(index, 1)
    setFeatures(newFeatures)
  }

  const handleSubmit = async () => {
    if (!formValid.details || !formValid.images || !formValid.features) {
      alert("Please complete all required sections before submitting.")
      return
    }

    setIsSubmitting(true)
    
    try {
      // Prepare the data for submission
      const truckData = {
        title: formData.title,
        price: Number(formData.price),
        year: Number(formData.year),
        make: formData.make,
        model: formData.model,
        trim: formData.trim,
        mileage: Number(formData.mileage),
        fuelType: formData.fuelType,
        transmission: formData.transmission,
        drivetrain: formData.drivetrain,
        color: formData.color,
        vin: formData.vin,
        stockNumber: formData.stockNumber,
        description: formData.description,
        status: "AVAILABLE" as const,
        featured: false,
        images: images,
        features: features
      }

      const response = await fetch('/api/trucks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(truckData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create truck listing')
      }

      const createdTruck = await response.json()
      
      // Success! Redirect to the inventory page
      alert("Truck listing created successfully!")
      router.push("/admin/inventory")
      
    } catch (error) {
      console.error('Error creating truck:', error)
      alert(`Failed to create truck listing: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Add New Truck" />
      
      <div className="flex-1 p-4 space-y-4">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/inventory")}
            className="gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Inventory</span>
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Add New Truck Listing</h1>
            <p className="text-muted-foreground">
              Create a new truck listing with detailed information, images, and features.
            </p>
          </div>

          <Tabs defaultValue="details" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-4 max-w-2xl mb-6">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline-block">Basic Details</span>
                <span className="sm:hidden">Details</span>
                {formValid.details && <Check className="h-5 w-5 ml-1 text-green-600 flex-shrink-0" />}
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline-block">Truck Images</span>
                <span className="sm:hidden">Images</span>
                {formValid.images && <Check className="h-5 w-5 ml-1 text-green-600 flex-shrink-0" />}
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                <span className="hidden sm:inline-block">Features & Specs</span>
                <span className="sm:hidden">Features</span>
                {formValid.features && <Check className="h-5 w-5 ml-1 text-green-600 flex-shrink-0" />}
              </TabsTrigger>
              <TabsTrigger value="review" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline-block">Review</span>
                <span className="sm:hidden">Review</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Details</CardTitle>
                  <CardDescription>Enter the basic information about the truck.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Truck Title</Label>
                      <Input 
                        id="title" 
                        placeholder="e.g. 2022 Ford F-150 XLT" 
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required 
                      />
                      <p className="text-xs text-muted-foreground">Include year, make, model, and trim</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        placeholder="e.g. 42999" 
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
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
                        placeholder="e.g. 2022" 
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Input 
                        id="make" 
                        placeholder="e.g. Ford, Chevrolet, Toyota" 
                        value={formData.make}
                        onChange={(e) => handleInputChange('make', e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Model</Label>
                      <Input 
                        id="model" 
                        placeholder="e.g. F-150, Silverado, Tundra" 
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trim">Trim Level</Label>
                      <Input 
                        id="trim" 
                        placeholder="e.g. XLT, Lariat, King Ranch" 
                        value={formData.trim}
                        onChange={(e) => handleInputChange('trim', e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mileage">Mileage</Label>
                      <Input 
                        id="mileage" 
                        type="number" 
                        placeholder="e.g. 15420" 
                        value={formData.mileage}
                        onChange={(e) => handleInputChange('mileage', e.target.value)}
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fuel-type">Fuel Type</Label>
                      <Select value={formData.fuelType} onValueChange={(value) => handleInputChange('fuelType', value)}>
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
                      <Select value={formData.transmission} onValueChange={(value) => handleInputChange('transmission', value)}>
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
                      <Select value={formData.drivetrain} onValueChange={(value) => handleInputChange('drivetrain', value)}>
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="color">Exterior Color</Label>
                      <Input 
                        id="color" 
                        placeholder="e.g. Oxford White" 
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vin">VIN</Label>
                      <Input 
                        id="vin" 
                        placeholder="e.g. 1FTEW1EP5NKD12345" 
                        value={formData.vin}
                        onChange={(e) => handleInputChange('vin', e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock-number">Stock Number</Label>
                      <Input
                        id="stock-number"
                        placeholder="e.g. STK12345"
                        value={formData.stockNumber}
                        onChange={(e) => handleInputChange('stockNumber', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of the truck's condition, features, and any notable details..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Minimum 100 characters required</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images">
              <Card>
                <CardHeader>
                  <CardTitle>Truck Images</CardTitle>
                  <CardDescription>Upload high-quality images of the truck. Minimum 3 images required.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    images={images}
                    onImagesChange={handleImagesChange}
                    maxFileSize={5}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Features & Specifications</CardTitle>
                  <CardDescription>Add key features and specifications. Minimum 3 features required.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a feature (e.g. SYNC 4 with 12-inch Touchscreen)"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddFeature()}
                    />
                    <Button onClick={() => handleAddFeature()}>Add</Button>
                  </div>

                  {features.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Added Features ({features.length})</h4>
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

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-4">Feature Suggestions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(featureSuggestions).map(([category, suggestions]) => (
                        <div key={category}>
                          <p className="font-medium text-green-900 mb-2">{category}:</p>
                          <div className="space-y-2">
                            {suggestions.map((suggestion) => (
                              <div key={suggestion} className="flex items-center justify-between">
                                <span className="text-sm text-green-800">• {suggestion}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="ml-2 h-6 text-xs"
                                  onClick={() => handleAddFeature(suggestion)}
                                  disabled={features.includes(suggestion)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="review">
              <Card>
                <CardHeader>
                  <CardTitle>Review & Publish</CardTitle>
                  <CardDescription>Review all information before publishing the truck listing.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`p-4 rounded-lg border ${formValid.details ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {formValid.details ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-red-600" />
                        )}
                        <h4 className="font-medium">Basic Details</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formValid.details ? "All required fields completed" : "Missing required information"}
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-lg border ${formValid.images ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {formValid.images ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-red-600" />
                        )}
                        <h4 className="font-medium">Images</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {images.length} images uploaded (minimum 3 required)
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-lg border ${formValid.features ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {formValid.features ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-red-600" />
                        )}
                        <h4 className="font-medium">Features</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {features.length} features added (minimum 3 required)
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Publishing Checklist</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>✓ All required fields are completed</li>
                      <li>✓ Minimum 3 high-quality images uploaded</li>
                      <li>✓ At least 3 key features listed</li>
                      <li>✓ Pricing is competitive and accurate</li>
                      <li>✓ Description is detailed and informative</li>
                    </ul>
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
                  <Button
                    onClick={handleSubmit}
                    disabled={!formValid.details || !formValid.images || !formValid.features || isSubmitting}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Creating Listing..." : "Publish Listing"}
                  </Button>
                )}
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
