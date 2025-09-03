import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import moment from "moment"
import { MapPin } from 'lucide-react'
import Map from '../../../components/map-popover'

export function AdminTableCard({ attendanceHistoryGroupByDate, isAdmin }) {
    return <>
        {Object.keys(attendanceHistoryGroupByDate).map((key, index) => {
            // const  attendanceHistoryGroupByDate[key]
            return (
                <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    defaultValue={Object.keys(attendanceHistoryGroupByDate)[0]}
                    key={index}
                >
                    <AccordionItem value={key}>
                        <AccordionTrigger>
                            <div className="flex space-x-8">
                                <div>
                                    {moment(key).format("DD dddd, MMMM-YYYY")}

                                </div>
                                {isAdmin && <div className='text-green-600'>
                                    Present: {attendanceHistoryGroupByDate[key].length}
                                </div>}
                            </div>

                            {/* {new Date(key).toLocaleDateString()} */}
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-4 text-balance">
                            <EmpTableCard attendanceHistory={attendanceHistoryGroupByDate[key]} isAdmin={isAdmin}/>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>)
        })
        }
    </>
}

export function EmpTableCard({ attendanceHistory, isAdmin, isEmp }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {isEmp && <TableHead>Date</TableHead>}
                    {isAdmin && <TableHead>Name</TableHead>}
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead className='flex'>
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                        Site (Click to Open in Google Maps)</TableHead>
                    <TableHead>Check In/Out photo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Overtime</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>

                {attendanceHistory.map((record, index) => (
                    <TableRow key={index}>

                        {isEmp && <TableCell className="font-medium">
                            {moment(record.date).format("DD ddd, MMM-YYYY")}
                        </TableCell>}
                        {isAdmin && <TableCell>{record?.fullName || "-"}</TableCell>}
                        <TableCell>{record.checkInTime}</TableCell>
                        <TableCell>{record.checkOutTime || "-"}</TableCell>
                        <TableCell>{record.workHours}</TableCell>
                        <TableCell>
                            <span className='text-green-400 pr-2'>
                                Check In:{"  "}
                            </span>
                            <samp>
                                <Map latitude={record?.checkInLocation?.latitude}
                                    label={record?.checkInLocation?.address}
                                    longitude={record?.checkInLocation?.longitude} />
                            </samp>
                            <br />
                            <span className='text-orange-400 pr-2'>
                                Check Out:

                            </span>
                            <Map latitude={record?.checkOutLocation?.latitude}
                                label={record?.checkOutLocation?.address}
                                longitude={record?.checkOutLocation?.longitude} />
                            {/* {record?.checkOutLocation?.address} */}
                            {/* <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" /> */}
                            {/* {` ${record?.checkOutLocation?.latitude}, ${record?.checkOutLocation?.longitude}`} */}
                            {/* </div> */}
                        </TableCell>
                        <TableCell>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <img data-popover-target="popover-default" src={record?.checkOutPhoto || record?.checkInPhoto} className="w-8 h-8 rounded-full" />
                                </PopoverTrigger>
                                <PopoverContent className="w-auto" align="start">
                                    <div className="w-full flex" >
                                        {record?.checkInPhoto &&
                                            <img data-popover-target="popover-default" src={record?.checkInPhoto} className="w-1/4 h-1/4" />
                                        }
                                        {
                                            record?.checkOutPhoto &&
                                            <img data-popover-target="popover-default" src={record?.checkOutPhoto} className="w-1/4 h-1/4" />
                                        }
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </TableCell>
                        <TableCell>
                            <Badge
                                variant={
                                    record.status == "present"
                                        ? "default"
                                        : record.status === "Late"
                                            ? "secondary"
                                            : "destructive"
                                }
                            >
                                {record.status}
                            </Badge>
                        </TableCell>
                        <TableCell>{record.overtimeHours}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>)
}