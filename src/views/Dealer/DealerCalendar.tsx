import { useState, useEffect } from "react";
import CalendarView from "@/components/shared/CalendarView";
import { Button, Menu, MenuItem } from "@/components/ui";
import { HiPlusCircle } from "react-icons/hi";
import { apiGetAllAppointment } from "./DealerLists/Services/DealerListServices";
import AddNewAppointmentModal from "./DealerSharedComponent/AddNewAppointmentModal";
import { EventClickArg } from "@fullcalendar/core";

const DealerCalendar = () => {
  const [eventsData, setEventsData] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isNewAppointment, setIsNewAppointment] = useState(true);

  console.log("Appointment in Calender : ", eventsData);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await apiGetAllAppointment();
        const appointments = response.allAppointment;

        // console.log("All appointment data : ", appointments)

        const transformedData = appointments.map((appointment: any) => ({
          id: appointment._id,
          title: appointment.title,
          start: new Date(appointment.start).toISOString(),
          end: appointment.end ? new Date(appointment.end).toISOString() : null,
          customer : appointment.customerId,
            vehicle : appointment.vehicleId,
          eventColor: appointment.eventColor || "gray",
          note: appointment.note || "",
          sendConfirmation: appointment.sendConfirmation,
          sendReminder: appointment.sendReminder,
        }));

        setEventsData(transformedData);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleEventClick = (arg: EventClickArg) => {
    // Set the selected event and open the modal
    const clickedEvent = eventsData.find((event) => event.id === arg.event.id);
    setSelectedEvent(clickedEvent);
    setIsNewAppointment(false);
    setModalOpen(true);
  };

  const handleNewAppointmentClick = () => {
    // Open modal for new appointment
    setSelectedEvent(null); // Reset selected event to null
    setIsNewAppointment(true); // Indicate this is a new appointment
    setModalOpen(true);
  };

  return (
    <div>
      <div style={{ flexDirection: "column" }} className="flex items-end space-x-2 mb-4">
        <Button
          variant="solid"
          type="button"
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center gap-1 px-3 py-1.5"
          onClick={handleNewAppointmentClick}
        >
          <HiPlusCircle className="h-4 w-4" />
          Add New Appointment
        </Button>
      </div>

      <CalendarView
        editable
        selectable
        events={eventsData}
        eventClick={handleEventClick}
        select={(event) => {}}
        eventDrop={(arg) => {}}
      />


{isModalOpen && (
        <AddNewAppointmentModal
          eventsData={eventsData}
          setEventsData={setEventsData}
          setModalOpen={setModalOpen}
          isModalOpen={isModalOpen}
          selectedEvent={selectedEvent} 
          isNewAppointment={isNewAppointment} 
        />
      )}
    </div>
  );
};

export default DealerCalendar;
