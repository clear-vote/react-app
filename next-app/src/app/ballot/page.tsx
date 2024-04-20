import { Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { Separator } from '@/components/ui/separator'
import LocationPicker from '@/components/custom/location-picker'
import DateCard from '@/components/custom/date-card'
import Map from '@/components/custom/map'
import Elections from '@/components/custom/elections'

interface Coordinates {
  lat: string | undefined;
  lng: string | undefined;
}

const defaultCoords: number[] = [-122.3076595, 47.654538] // University of Washington

export default function MyBallotPage({ searchParams }: { searchParams: Coordinates }) {

  return (
    <main className="min-h-screen py-32 flex flex-col gap-16 items-center bg-gradient-to-r from-[#FFF4F3] to-[#F5EDFF]">
      <section className="max-w-[calc(100vw-8rem)] w-full p-16 flex flex-col gap-6 items-center bg-gradient rounded-xl">
        <div className="max-w-[660px] w-full text-white">
          <Suspense>
            <Map
              token={process.env.MAPBOX_TOKEN}
            />
          </Suspense>
        </div>
        <div className="max-w-[500px] w-full hidden" >
          {/* <LocationPicker />  TODO: implement */}
        </div>
      </section>

      <section className="max-w-[1200px] w-[calc(100%-8rem)] flex">
        <Suspense>
          <Elections />
        </Suspense>
      </section>

      


      {/* <section className="max-w-[1200px] w-[calc(100%-8rem)] flex justify-center items-center">
        <Suspense>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Elections />
          </div>
        </Suspense>
      </section> */}

    </main>
  )
}
