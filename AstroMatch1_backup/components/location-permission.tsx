"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocation } from "@/lib/hooks/use-location"
import { MapPin, CheckCircle2, AlertCircle } from "lucide-react"

interface LocationPermissionProps {
  onLocationEnabled?: () => void
  showCard?: boolean
}

export function LocationPermission({ onLocationEnabled, showCard = true }: LocationPermissionProps) {
  const { location, loading, error, isSupported, requestLocation } = useLocation()
  const [permissionState, setPermissionState] = useState<"prompt" | "granted" | "denied" | "unsupported">("prompt")

  useEffect(() => {
    if (location) {
      setPermissionState("granted")
      onLocationEnabled?.()
    } else if (error) {
      if (error.code === 1) {
        setPermissionState("denied")
      } else if (error.code === 0) {
        setPermissionState("unsupported")
      }
    }
  }, [location, error, onLocationEnabled])

  const handleRequestLocation = async () => {
    await requestLocation()
  }

  if (!showCard) {
    return (
      <Button
        onClick={handleRequestLocation}
        disabled={loading || !isSupported}
        className="w-full"
        variant={permissionState === "granted" ? "outline" : "default"}
      >
        {loading ? (
          <>Loading location...</>
        ) : permissionState === "granted" ? (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Location Enabled
          </>
        ) : (
          <>
            <MapPin className="w-4 h-4 mr-2" />
            Enable Location
          </>
        )}
      </Button>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-500" />
          <CardTitle>Location Access</CardTitle>
        </div>
        <CardDescription>
          {permissionState === "granted"
            ? "Your location is enabled for matching"
            : "Enable location to find matches nearby"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {permissionState === "unsupported" && (
          <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">Your browser doesn't support geolocation.</p>
          </div>
        )}

        {permissionState === "denied" && (
          <div className="flex items-start gap-2 p-3 bg-orange-50 text-orange-700 rounded-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Location access denied</p>
              <p>Please enable location access in your browser settings to find matches nearby.</p>
            </div>
          </div>
        )}

        {permissionState === "granted" && location && (
          <div className="flex items-start gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Location enabled</p>
              <p className="text-green-600">Last updated: {new Date(location.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}

        <Button
          onClick={handleRequestLocation}
          disabled={loading || !isSupported || permissionState === "denied"}
          className="w-full"
          variant={permissionState === "granted" ? "outline" : "default"}
        >
          {loading ? (
            <>Loading location...</>
          ) : permissionState === "granted" ? (
            <>
              <MapPin className="w-4 h-4 mr-2" />
              Update Location
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 mr-2" />
              Enable Location
            </>
          )}
        </Button>

        {permissionState === "prompt" && (
          <p className="text-xs text-gray-500 text-center">
            We'll use your location to show you matches nearby. Your precise location is never shared with other users.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

