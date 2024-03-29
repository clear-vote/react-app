'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image'
// import { defaultCoords } from '../../app/myballot/page'


import {
     Dialog,
     DialogContent,
     DialogTrigger,
} from "@/components/ui/dialog"
import { useSearchParams } from 'next/navigation';

const defaultCoords: number[] = [-122.3076595, 47.654538] // TODO: should be an export
interface PositionInfo {
     boundary_type: string;
     title_string: string;
     area_name: string;
     district_char: string | null;
     position_char: string | null;
}

interface Contest {
     position_info: PositionInfo;
     candidate_info: Candidate[]; // Define this more precisely based on your actual data structure
}

interface Candidate {
     name: string | null;
     image: string | null;
     email: string | null;
     website: string | null;
     education: string | null;
     occupation: string | null;
     statement: string | null;
     statement_source: string | null;
     pfms: any[] | null;
     politigram_quotes: any[] | null;
}

interface ElectionItem {
     election_id: number;
     election_type: string;
     voting_start: number;
     register_by: number;
     voting_end: number;
     contests: Contest[];
}

interface ContestProps {
     contest_data: ElectionItem[];
     election_id: number;
     // congressional_district: string;
     // legislative_district: string;
     // county: string;
     // county_council_district: string;
     // city: string;
     // city_council_district: string;
     // school_district: string;
}

const Contests = ({
     contest_data,
     election_id,
}: ContestProps) => {
     const [contests, setContests] = useState<Contest[]>([]);
     // const [cityCouncilData, setCityCouncilData] = useState<any>({});
     // const [cityData, setCityData] = useState<any>({});
     // const [countyCouncilData, setCountyCouncilData] = useState<any>({});
     // const [schoolDistrictData, setSchoolDistrictData] = useState<any>({});
     // const [loading, setLoading] = useState(true);
     // const [error, setError] = useState(null);

     const searchParams = useSearchParams()!;
     let longitude = parseFloat(searchParams.get('lng') || `${defaultCoords[0]}`);
     let latitude = parseFloat(searchParams.get('lat') || `${defaultCoords[1]}`);


     // filters data to get only the selected contests
     useEffect(() => {
          // Fetch district information based on coordinates
          const fetchContests = async () => {
               try {
                    // const fetchData = async (url: string) => {
                    //      try {
                    //           const response = await fetch(url);
                    //           if (!response.ok) {
                    //                throw new Error('Data could not be fetched!');
                    //           } else {
                    //                return await response.json();
                    //           }
                    //      } catch (err: any) {
                    //           setError(err.message);
                    //           setLoading(false);
                    //      }
                    // };
                    // try {
                    //      // Fetching multiple pieces of GeoJSON data in parallel
                    //      const [data1, data2, data3, data4] = await Promise.all([
                    //           fetchData('../../lib/data/city_council_district.geojson'),
                    //           fetchData('../../lib/data/geojson/city.geojson'),
                    //           fetchData('../../lib/data/geojson/county_council_district.geojson'),
                    //           fetchData('../../lib/data/geojson/school_district.geojson'),
                    //      ]);

                    //      setCityCouncilData(data1);
                    //      setCityData(data2)
                    //      setCountyCouncilData(data3);
                    //      setSchoolDistrictData(data4);
                    // } catch (err: any) {
                    //      setError(err.message);
                    // } finally {
                    //      setLoading(false);
                    // }

                    let city = '1';
                    // alert(cityData.features)
                    // for (let feature of cityData.features) {
                    //      if (geoContains(feature, [longitude, latitude])) {
                    //           city = feature.properties.name;
                    //           break;
                    //      }
                    // }

                    let countyCouncilDistrict = '1';
                    // for (let feature of countyCouncilData.features) {
                    //      if (geoContains(feature, [longitude, latitude])) {
                    //           countyCouncilDistrict = feature.properties.name;
                    //           break;
                    //      }
                    // }

                    let cityCouncilDistrict = '1';
                    // for (let feature of cityCouncilData.features) {
                    //      if (geoContains(feature, [longitude, latitude])) {
                    //           cityCouncilDistrict = feature.properties.name;
                    //           break;
                    //      }
                    // }

                    let schoolDistrict = '1';
                    // for (let feature of schoolDistrictData.features) {
                    //      if (geoContains(feature, [longitude, latitude])) {
                    //           schoolDistrict = feature.properties.name;
                    //           break;
                    //      }
                    // }

                    const filteredContests = contest_data
                         .filter((item: ElectionItem) => item.election_id === election_id)
                         .flatMap((item: ElectionItem) => item.contests)
                         .filter((contest: Contest) => {
                              const { position_info } = contest;
                              const { boundary_type, area_name, district_char } = position_info;
                              return (
                                   (boundary_type === 'congressional' && district_char === '0') ||
                                   (boundary_type === 'legislative' && district_char === '0') ||
                                   (boundary_type === 'county' && area_name.toLowerCase() === 'king') ||
                                   (boundary_type === 'county council' && district_char === countyCouncilDistrict) ||
                                   (boundary_type === 'city' && area_name.toLowerCase() === city) ||
                                   (boundary_type === 'city council' && district_char === cityCouncilDistrict) ||
                                   (boundary_type === 'school district' && district_char === schoolDistrict)
                              );
                         });
                    setContests(filteredContests);
               } catch (error) {
                    console.error("Failed to load contests", error);
               }
          };

          fetchContests();
     }, [contest_data, election_id, longitude, latitude, /*cityCouncilData, cityData, countyCouncilData, schoolDistrictData*/]);

     // Ensure the component correctly handles rendering of contests
     return (
          <div>
               {contests.map((contest, index) => (
                    <div key={index} className="contest-item">
                         <h3>{contest.position_info.area_name} {contest.position_info.title_string}
                              {contest.position_info.district_char ? ` district number ${contest.position_info.district_char}` : ''}
                              {contest.position_info.position_char ? ` position number ${contest.position_info.position_char}` : ''}</h3>
                         {contest.candidate_info ? contest.candidate_info.map((candidate, candidateIndex) => (
                              <CandidateCard key={candidateIndex} {...candidate} />
                         )) : <p>No candidates available.</p>}
                    </div>
               ))}
          </div>
     );
};

export function CandidateCard(props: Candidate) {
     return (
          <Dialog>
               <DialogTrigger>
                    <div className="flex-none bg-card hover:bg-neutral-100 elevation-1 border border-1 rounded-lg p-6 flex flex-col gap-0 items-start max-w-[calc(200px+1.5rem)]">
                         {/* Use a conditional rendering to check if the image URL is from an unconfigured host */}
                         <Image
                              src={props.image || ''}
                              alt="candidate headshot"
                              height={200}
                              width={200}
                              className="border rounded-sm mb-4"
                              unoptimized={!!(props.image && props.image.startsWith('https://info.kingcounty.gov'))}
                         />
                         <p className="text-lg font-600">{props.name}</p>
                         <p className="break-all text-sm">{props.website}</p>
                    </div>
               </DialogTrigger>
               <DialogContent className="flex flex-col w-[calc(100vw-2rem)] sm:w-[calc(100vw-8rem)] max-w-screen-sm max-h-[calc(100vh-4rem)] pr-0 bg-clip-border">
                    <div className="items-stretch overflow-y-scroll pt-16 pr-8">
                         <div className="bg-slate-300 w-full h-16 fixed top-0 left-0 z-0"></div>
                         {/* Repeat the conditional rendering for the detailed image */}
                         <Image
                              src={props.image || ''} // Use an empty string as a default value if props.image is null
                              alt="candidate headshot"
                              height={200}
                              width={200}
                              className="border rounded-sm mb-4"
                              unoptimized={!!(props.image && props.image.startsWith('https://info.kingcounty.gov'))}
                         />
                         <h2>{props.name}</h2>
                         <div className="flex gap-8 mt-4 w-full">
                              <div className="flex flex-col py-3 px-4 bg-muted rounded-lg grow">
                                   <p className="font-500">Campaign Website</p>
                                   <p>{props.website}</p>
                              </div>
                         </div>
                         <h4 className="mt-8">Education</h4>
                         <p className="mt-2">{props.education}</p>
                         <h4 className="mt-8">Occupation</h4>
                         <p className="mt-2">{props.occupation}</p>
                         <h4 className="mt-8">Statement</h4>
                         <p className="mt-2">{props.statement}</p>

                         <div className="mt-8 flex flex-col text-secondary italic pr-4">
                              <small>Retrieved from {props.statement_source}</small>
                              {/* TODO: implement retrieval date */}
                              <small className="mt-4">ClearVote does not correct punctuation, grammar, or fact check candidate and measure statements.</small>
                         </div>
                    </div>

               </DialogContent>
          </Dialog>
     )
}

export default Contests;