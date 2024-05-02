import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom"

import * as apiClient from "../api-client";
import ManageHotelForms from "../forms/ManageHotelForm/ManageHotelForms";
import { useAppContext } from "../contexts/AppContext";

const EditHotel = () => {
    const { hotelId } = useParams();
    const { showToast } = useAppContext();

    const { data: hotel } = useQuery("fetchMyHotelById", () => 
        apiClient.fetchMyHotelsById(hotelId || ""),
        {
            enabled: !!hotelId
        }
    );

    const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
        onSuccess: () => {
            showToast({ message: "Hotel Saved!", type: "SUCCESS" })
        },
        onError: () => {
            showToast({ message: "Error Saving Hotel", type: "ERROR" })
        }
    });

    const handleSave = ( hotelFormData: FormData ) => {
        mutate(hotelFormData);
    }

    return <ManageHotelForms hotel={hotel} onSave={handleSave} isLoading={isLoading}/>
}

export default EditHotel;
