// import { Box, Flex, Text } from "@chakra-ui/react";
// import moment from "moment";

// // Enum for appointment status codes
// export enum AppointmentStatusCode {
//   Pending = "P",
//   CheckedIn = "CI",
// }

// // Type for appointment
// export type Appointment = {
//   id: number;
//   status: AppointmentStatusCode;
//   location: string;
//   resource: string;
//   address: string;
// };

// // Type for event item
// export type EventItem = {
//   start?: Date | string;
//   end?: Date | string;
//   data?: { appointment?: Appointment };
//   isDraggable?: boolean;
//   isResizable?: boolean;
//   resourceId?: number;
// };

// // Constants for event status colors
// export const EVENT_STATUS_COLORS = {
//   [AppointmentStatusCode.Pending]: "#bee2fa",
//   [AppointmentStatusCode.CheckedIn]: "#c7edca",
// };

// // Array of events
// export const EVENTS: EventItem[] = [
//   {
//     start: moment("2022-10-10T09:00:00").toDate(),
//     end: moment("2022-10-10T10:00:00").toDate(),
//     data: {
//       appointment: {
//         id: 1,
//         status: AppointmentStatusCode.Pending,
//         location: "New York",
//         resource: "Dr Alex",
//         address: "Building 5\nStreet 44\nNear Express Highway\nNew York",
//       },
//     },
//     isDraggable: true,
//     resourceId: 1,
//   },
//   {
//     start: moment("2022-10-10T10:30:00").toDate(),
//     end: moment("2022-10-10T11:00:00").toDate(),
//     data: {
//       appointment: {
//         id: 2,
//         status: AppointmentStatusCode.CheckedIn,
//         location: "Washington",
//         resource: "Dr David",
//         address: "Block 1\nSStreet 32\nLong Island\nNew York",
//       },
//     },
//     isDraggable: true,
//     isResizable: true,
//     resourceId: 2,
//   },
// ];

// // AppointmentEvent component
// export default function AppointmentEvent({
//   appointment,
// }: {
//   appointment: Appointment;
// }) {
//   const { location, status, resource, address } = appointment;
//   const background = EVENT_STATUS_COLORS[status];

//   return (
//     <Box bg={background} p={1} height="100%" color="black">
//       <Flex alignItems={"center"} justifyContent="space-between">
//         <Flex>
//          <Text fontSize="xs">{location}</Text>
//         </Flex>
//         <Flex>
//           <Text fontSize="xs">{resource}</Text>
//         </Flex>
//       </Flex>
//       <Box mt={4}>
//         {address.split("\n").map((add, index) => (
//           <Text key={index} fontSize="xs">{add}</Text>
//         ))}
//       </Box>
//     </Box>
//   );
// }