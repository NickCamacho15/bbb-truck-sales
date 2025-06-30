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
import { AdminSidebar } from "@/components/admin-sidebar"
import { ArrowLeft, Check, ChevronRight, ImageIcon, Info, ListChecks, Save, Upload, X } from "lucide-react"

export default function NewTruckPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("details")
  const [images, setImages] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [formValid, setFormValid] = useState({
    details: false,
    images: false,
    features: false,
  })

  // Form validation
  const validateDetailsTab = () => {
    // This would check if all required fields are filled
    setFormValid((prev) => ({ ...prev, details: true }))
    return true
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

  const handleAddImage = () => {
    // In a real app, this would handle image upload
    // For demo, we'll add a placeholder
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
    // In a real app, this would save the truck to the database
    alert("Truck listing created successfully!")
    router.push("/admin/inventory")
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AdminSidebar activePage="inventory" />

      <div className="flex flex-col">
        <AdminHeader title="Add New Truck" />

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
            <h1 className="text-2xl font-bold">Add New Truck Listing</h1>
            <p className="text-muted-foreground">
              Create a new truck listing with detailed information, images, and features.
            </p>
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
                  <CardDescription>Enter the basic information about the truck.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Truck Title</Label>
                      <Input id="title" placeholder="e.g. 2022 Ford F-150 XLT" required />
                      <p className="text-xs text-muted-foreground">Include year, make, model, and trim</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input id="price" type="number" placeholder="e.g. 42999" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input id="year" type="number" placeholder="e.g. 2022" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="make">Make</Label>
                      <Select defaultValue="ford">
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
                      <Select>
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
                      <Input id="trim" placeholder="e.g. XLT, Lariat, King Ranch" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mileage">Mileage</Label>
                      <Input id="mileage" type="number" placeholder="e.g. 15420" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fuel-type">Fuel Type</Label>
                      <Select>
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
                      <Select>
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
                      <Select>
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
                      <Input id="color" placeholder="e.g. Oxford White" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vin">VIN</Label>
                      <Input id="vin" placeholder="e.g. 1FTEW1EP5NKD12345" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of the truck's condition, features, and any notable details..."
                      rows={4}
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
                      <h4 className="font-medium mb-2">Uploaded Images ({images.length})</h4>
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

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Image Requirements</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Minimum 3 images required</li>
                      <li>• Include exterior shots from all angles</li>
                      <li>• Add interior photos showing dashboard, seats, and cargo area</li>
                      <li>• Include engine bay and undercarriage if applicable</li>
                      <li>• Use high resolution (minimum 1200x800 pixels)</li>
                      <li>• Ensure good lighting and clear visibility</li>
                    </ul>
                  </div>
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
                    <Button onClick={handleAddFeature}>Add</Button>
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
                    <h4 className="font-medium text-green-900 mb-2">Feature Suggestions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-800">
                      <div>
                        <p className="font-medium mb-1">Technology:</p>
                        <ul className="space-y-1">
                          <li>• SYNC 4 Infotainment System</li>
                          <li>• 360-Degree Camera</li>
                          <li>• Wireless Phone Charging</li>
                          <li>• Apple CarPlay/Android Auto</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Safety:</p>
                        <ul className="space-y-1">
                          <li>• Pre-Collision Assist</li>
                          <li>• Blind Spot Monitoring</li>
                          <li>• Lane-Keeping System</li>
                          <li>• Adaptive Cruise Control</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Comfort:</p>
                        <ul className="space-y-1">
                          <li>• Heated/Cooled Seats</li>
                          <li>• Dual-Zone Climate Control</li>
                          <li>• Power-Adjustable Seats</li>
                          <li>• Remote Start</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Capability:</p>
                        <ul className="space-y-1">
                          <li>• Pro Power Onboard</li>
                          <li>• Trailer Tow Package</li>
                          <li>• Bed Liner</li>
                          <li>• Running Boards</li>
                        </ul>
                      </div>
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
                    disabled={!formValid.details || !formValid.images || !formValid.features}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Publish Listing
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
