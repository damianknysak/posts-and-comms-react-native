import { View, Text, TouchableOpacity, Keyboard } from "react-native";
import React, { useEffect, useState } from "react";
import { PencilSquareIcon, XMarkIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

const EditDateOfBirthScreen = () => {
  const [errorInfo, setErrorInfo] = useState("");
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date(2000, 0, 1));

  const handleEdit = async () => {};
  return (
    <View className="h-full w-screen items-center justify-center">
      <View
        style={{ elevation: 300 }}
        className="relative w-5/6 rounded-3xl mb-52 pb-3 bg-violet-500 "
      >
        <Text className="font-bold text-center mt-4 text-lg">
          Zmień datę urodzenia
        </Text>
        <TouchableOpacity
          className="absolute bg-black/50 p-1 items-center justify-center rounded-full right-3 top-3"
          onPress={() => {
            navigation.goBack();
          }}
        >
          <XMarkIcon size={30} color="black" />
        </TouchableOpacity>
        {errorInfo && (
          <View className="flex-row ml-2 space-x-2 items-center">
            <ExclamationCircleIcon size={30} color="red" />
            <Text className="text-red-700">{errorInfo}</Text>
          </View>
        )}

        <View className="m-3 space-y-1">
          {date && <DateTimePicker value={date} mode="date" />}
          <Text>{date.toLocaleDateString()}</Text>
          <View className="my-2"></View>
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              navigation.navigate("CustomDialog", {
                handleDelete: handleEdit,
                topic: "Zmień datę urodzenia",
                description:
                  "Czy jesteś pewien, że chcesz zmienić Datę Urodzenia ?",
              });
            }}
            className="flex-row py-1 justify-center space-x-3 bg-white rounded items-center"
          >
            <PencilSquareIcon size={20} color="black" />
            <Text className="text-black py-2 font-bold">Zmień</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EditDateOfBirthScreen;
