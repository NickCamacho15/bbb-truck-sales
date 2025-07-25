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
import { smoothScrollToTop } from "@/utils/scroll"

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
  const [listingType, setListingType] = useState<"SALE" | "LEASE">("SALE")

  // Form data state for validation
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    monthlyPrice: "",
    leaseTermMonths: "",
    downPayment: "",
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
    // Base required fields for both listing types
    const baseRequiredFields = ['title', 'year', 'make', 'model', 'trim', 'mileage', 'fuelType', 'transmission', 'drivetrain', 'color', 'vin', 'stockNumber', 'description']
    
    // Add price fields based on listing type
    const requiredFields = [...baseRequiredFields]
    
    if (listingType === "SALE") {
      requiredFields.push('price')
    } else {
      requiredFields.push('monthlyPrice', 'leaseTermMonths', 'downPayment')
    }
    
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
    // Scroll to top of page
    smoothScrollToTop()
  }

  const handleNextTab = () => {
    if (activeTab === "details") {
      if (validateDetailsTab()) {
        setActiveTab("images")
        smoothScrollToTop()
      } else {
        alert("Please fill out all required fields before proceeding.")
      }
    } else if (activeTab === "images") {
      if (validateImagesTab()) {
        setActiveTab("features")
        smoothScrollToTop()
      } else {
        alert("Please upload at least 3 images before proceeding.")
      }
    } else if (activeTab === "features") {
      if (validateFeaturesTab()) {
        setActiveTab("review")
        smoothScrollToTop()
      } else {
        alert("Please add at least 3 features before proceeding.")
      }
    }
  }

  const handlePrevTab = () => {
    if (activeTab === "images") setActiveTab("details")
    else if (activeTab === "features") setActiveTab("images")
    else if (activeTab === "review") setActiveTab("features")
    // Scroll to top of page
    smoothScrollToTop()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleListingTypeChange = (type: "SALE" | "LEASE") => {
    // Prevent changing listing type if not on the details tab
    if (activeTab !== "details") {
      return;
    }
    
    setListingType(type)
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
        listingType,
        price: listingType === "SALE" ? Number(formData.price) : 0,
        monthlyPrice: listingType === "LEASE" ? Number(formData.monthlyPrice) : null,
        leaseTermMonths: listingType === "LEASE" ? Number(formData.leaseTermMonths) : null,
        downPayment: listingType === "LEASE" ? Number(formData.downPayment) : null,
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

        <div className="space-y-4 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Add New Truck Listing</h1>
              <p className="text-muted-foreground">
                Create a new truck listing with detailed information, images, and features.
              </p>
            </div>
            
            {/* Locked listing type indicator when not on details tab */}
            {activeTab !== "details" && (
              <div className={`px-4 py-2 rounded-md ${listingType === "SALE" ? "bg-blue-50 text-blue-800 border border-blue-200" : "bg-green-50 text-green-800 border border-green-200"}`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {listingType === "SALE" ? "For Sale Listing" : "For Lease Listing"}
                  </span>
                  {listingType === "LEASE" && (
                    <span className="text-xs bg-green-100 px-2 py-0.5 rounded-full">
                      Lease
                    </span>
                  )}
                  {listingType === "SALE" && (
                    <span className="text-xs bg-blue-100 px-2 py-0.5 rounded-full">
                      Sale
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Listing Type Selection */}
          <div className="w-full">
            <h2 className="text-lg font-semibold mb-2">Listing Type</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={`${activeTab !== "details" ? "opacity-60 pointer-events-none" : "cursor-pointer"} ${listingType === "SALE" ? "border-2 border-primary" : ""}`} 
                onClick={() => handleListingTypeChange("SALE")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">For Sale</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">List this truck with a fixed sale price.</p>
                  {activeTab !== "details" && listingType !== "SALE" && (
                    <p className="text-xs text-amber-600 mt-2">Cannot change listing type after details are filled</p>
                  )}
                </CardContent>
              </Card>
              <Card 
                className={`${activeTab !== "details" ? "opacity-60 pointer-events-none" : "cursor-pointer"} ${listingType === "LEASE" ? "border-2 border-primary" : ""}`} 
                onClick={() => handleListingTypeChange("LEASE")}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">For Lease</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">List this truck with monthly lease terms.</p>
                  {activeTab !== "details" && listingType !== "LEASE" && (
                    <p className="text-xs text-amber-600 mt-2">Cannot change listing type after details are filled</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs defaultValue="details" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-6">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span>Details</span>
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span>Images</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                <span>Features</span>
              </TabsTrigger>
              <TabsTrigger value="review" className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Review</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 w-full">
              <Card>
                <CardHeader>
                  <CardTitle>Truck Details</CardTitle>
                  <CardDescription>
                    Enter all the information about the truck.
                    <span className="block text-rose-500 mt-1">* indicates a required field</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Listing Title *</Label>
                        <Input 
                          id="title" 
                          placeholder="e.g. 2022 Ford F-150 XLT" 
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          required
                        />
                      </div>

                      {listingType === "SALE" ? (
                        <div className="space-y-2">
                          <Label htmlFor="price">Sale Price ($) *</Label>
                          <Input 
                            id="price" 
                            type="number" 
                            placeholder="e.g. 45000" 
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            required
                          />
                        </div>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="monthlyPrice">Monthly Lease Price ($) *</Label>
                            <Input 
                              id="monthlyPrice" 
                              type="number" 
                              placeholder="e.g. 550" 
                              value={formData.monthlyPrice}
                              onChange={(e) => handleInputChange('monthlyPrice', e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="downPayment">Down Payment ($) *</Label>
                            <Input 
                              id="downPayment" 
                              type="number" 
                              placeholder="e.g. 2500" 
                              value={formData.downPayment}
                              onChange={(e) => handleInputChange('downPayment', e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="leaseTermMonths">Lease Term (months) *</Label>
                            <Input 
                              id="leaseTermMonths" 
                              type="number" 
                              placeholder="e.g. 36" 
                              value={formData.leaseTermMonths}
                              onChange={(e) => handleInputChange('leaseTermMonths', e.target.value)}
                              required
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Vehicle Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="year">Year *</Label>
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
                        <Label htmlFor="make">Make *</Label>
                        <Input 
                          id="make" 
                          placeholder="e.g. Ford" 
                          value={formData.make}
                          onChange={(e) => handleInputChange('make', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="model">Model *</Label>
                        <Input 
                          id="model" 
                          placeholder="e.g. F-150" 
                          value={formData.model}
                          onChange={(e) => handleInputChange('model', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trim">Trim *</Label>
                        <Input 
                          id="trim" 
                          placeholder="e.g. XLT" 
                          value={formData.trim}
                          onChange={(e) => handleInputChange('trim', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mileage">Mileage *</Label>
                        <Input 
                          id="mileage" 
                          type="number" 
                          placeholder="e.g. 15000" 
                          value={formData.mileage}
                          onChange={(e) => handleInputChange('mileage', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color">Color *</Label>
                        <Input 
                          id="color" 
                          placeholder="e.g. Oxford White" 
                          value={formData.color}
                          onChange={(e) => handleInputChange('color', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fuelType">Fuel Type *</Label>
                        <Select 
                          value={formData.fuelType} 
                          onValueChange={(value) => handleInputChange('fuelType', value)}
                          required
                        >
                          <SelectTrigger id="fuelType">
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Gasoline">Gasoline</SelectItem>
                            <SelectItem value="Diesel">Diesel</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                            <SelectItem value="Electric">Electric</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="transmission">Transmission *</Label>
                        <Select 
                          value={formData.transmission} 
                          onValueChange={(value) => handleInputChange('transmission', value)}
                          required
                        >
                          <SelectTrigger id="transmission">
                            <SelectValue placeholder="Select transmission" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                            <SelectItem value="Manual">Manual</SelectItem>
                            <SelectItem value="CVT">CVT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="drivetrain">Drivetrain *</Label>
                        <Select 
                          value={formData.drivetrain} 
                          onValueChange={(value) => handleInputChange('drivetrain', value)}
                          required
                        >
                          <SelectTrigger id="drivetrain">
                            <SelectValue placeholder="Select drivetrain" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4WD">4WD</SelectItem>
                            <SelectItem value="AWD">AWD</SelectItem>
                            <SelectItem value="RWD">RWD</SelectItem>
                            <SelectItem value="FWD">FWD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="vin">VIN *</Label>
                        <Input 
                          id="vin" 
                          placeholder="e.g. 1FT8W3BT6NED27245" 
                          value={formData.vin}
                          onChange={(e) => handleInputChange('vin', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stockNumber">Stock Number *</Label>
                        <Input 
                          id="stockNumber" 
                          placeholder="e.g. T12345" 
                          value={formData.stockNumber}
                          onChange={(e) => handleInputChange('stockNumber', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Enter a detailed description of the truck..." 
                        rows={5}
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button onClick={handleNextTab} className="gap-1">
                  <span>Next: Images</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-4 w-full">
              <Card>
                <CardHeader>
                  <CardTitle>Truck Images</CardTitle>
                  <CardDescription>
                    Upload images of the truck. The first image will be used as the main image.
                    <span className="text-rose-500 font-medium"> * At least 3 images required.</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUpload 
                    value={images} 
                    onChange={handleImagesChange} 
                    onRemove={(url) => setImages(images.filter(image => image !== url))}
                  />
                  
                  {images.length < 3 && (
                    <p className="text-sm text-amber-600 mt-2">
                      Please upload at least 3 images of the truck.
                    </p>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevTab} className="gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
                <Button onClick={handleNextTab} className="gap-1">
                  <span>Next: Features</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4 w-full">
              <Card>
                <CardHeader>
                  <CardTitle>Truck Features</CardTitle>
                  <CardDescription>
                    Add features and specifications for this truck.
                    <span className="text-rose-500 font-medium"> * At least 3 features required.</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label htmlFor="newFeature" className="mb-2">
                          Add Feature
                        </Label>
                        <Input 
                          id="newFeature"
                          placeholder="e.g. Trailer Tow Package" 
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newFeature.trim()) {
                              e.preventDefault()
                              handleAddFeature()
                            }
                          }}
                        />
                      </div>
                      <Button 
                        onClick={() => handleAddFeature()} 
                        disabled={!newFeature.trim()}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Current Features ({features.length})</Label>
                      {features.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No features added yet.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {features.map((feature, index) => (
                            <div 
                              key={index}
                              className="bg-muted rounded-md px-3 py-1 flex items-center gap-2"
                            >
                              <span className="text-sm">{feature}</span>
                              <button 
                                onClick={() => handleRemoveFeature(index)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {features.length < 3 && (
                        <p className="text-sm text-amber-600">
                          Please add at least 3 features.
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <Label>Suggested Features</Label>
                      {Object.entries(featureSuggestions).map(([category, items]) => (
                        <div key={category} className="space-y-2">
                          <h4 className="text-sm font-medium">{category}</h4>
                          <div className="flex flex-wrap gap-2">
                            {items.map((feature, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() => handleAddFeature(feature)}
                                disabled={features.includes(feature)}
                                className="text-xs h-8"
                              >
                                {features.includes(feature) ? (
                                  <Check className="mr-1 h-3 w-3" />
                                ) : (
                                  <Plus className="mr-1 h-3 w-3" />
                                )}
                                {feature}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevTab} className="gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
                <Button onClick={handleNextTab} className="gap-1" disabled={features.length < 3}>
                  <span>Next: Review</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="review" className="space-y-4 w-full">
              <Card>
                <CardHeader>
                  <CardTitle>Review Listing</CardTitle>
                  <CardDescription>
                    Review all information before creating the listing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <span className="text-sm text-muted-foreground">Title</span>
                            <p>{formData.title || "Not provided"}</p>
                          </div>
                          {listingType === "SALE" ? (
                            <div>
                              <span className="text-sm text-muted-foreground">Sale Price</span>
                              <p>{formData.price ? `$${Number(formData.price).toLocaleString()}` : "Not provided"}</p>
                            </div>
                          ) : (
                            <>
                              <div>
                                <span className="text-sm text-muted-foreground">Monthly Price</span>
                                <p>{formData.monthlyPrice ? `$${Number(formData.monthlyPrice).toLocaleString()}/month` : "Not provided"}</p>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground">Down Payment</span>
                                <p>{formData.downPayment ? `$${Number(formData.downPayment).toLocaleString()}` : "Not provided"}</p>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground">Lease Term</span>
                                <p>{formData.leaseTermMonths ? `${formData.leaseTermMonths} months` : "Not provided"}</p>
                              </div>
                            </>
                          )}
                          <div>
                            <span className="text-sm text-muted-foreground">Listing Type</span>
                            <p>{listingType === "SALE" ? "For Sale" : "For Lease"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold">Vehicle Information</h3>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <span className="text-sm text-muted-foreground">Year</span>
                            <p>{formData.year || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Make</span>
                            <p>{formData.make || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Model</span>
                            <p>{formData.model || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Trim</span>
                            <p>{formData.trim || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Mileage</span>
                            <p>{formData.mileage ? `${Number(formData.mileage).toLocaleString()} miles` : "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Color</span>
                            <p>{formData.color || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Fuel Type</span>
                            <p>{formData.fuelType || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Transmission</span>
                            <p>{formData.transmission || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Drivetrain</span>
                            <p>{formData.drivetrain || "Not provided"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold">Additional Information</h3>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <span className="text-sm text-muted-foreground">VIN</span>
                            <p>{formData.vin || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Stock Number</span>
                            <p>{formData.stockNumber || "Not provided"}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-sm text-muted-foreground">Description</span>
                          <p className="whitespace-pre-line">{formData.description || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">Images ({images.length})</h3>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {images.length > 0 ? (
                            images.slice(0, 4).map((url, index) => (
                              <div key={index} className="relative aspect-video bg-muted rounded-md overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={url}
                                  alt={`Truck image ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                                {index === 0 && (
                                  <span className="absolute top-1 left-1 bg-primary/80 text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                                    Primary
                                  </span>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground col-span-2">No images provided</p>
                          )}
                          {images.length > 4 && (
                            <div className="col-span-2">
                              <p className="text-sm text-muted-foreground">+ {images.length - 4} more images</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold">Features ({features.length})</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {features.length > 0 ? (
                            features.map((feature, index) => (
                              <span 
                                key={index}
                                className="bg-muted rounded-md px-2 py-1 text-sm"
                              >
                                {feature}
                              </span>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No features provided</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrevTab} className="gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !formValid.details || !formValid.images || !formValid.features} 
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Upload className="h-4 w-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Create Listing</span>
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
