import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, X, Trash, User } from 'lucide-react-native';
import ComponentWrapper from '../../../components/ComponentWrapper';
import { ActivityIndicator } from 'react-native';
import Indicator from '../../../components/Indicator';
import { useAuth } from '../../../context/AuthProvider';
import { 
    get_partners_request, 
    delete_invitations,
    accepts_invitations,
    cancels_invitations 
} from '../../main_tab_screens/ScreensAPI';


const PartnerRequestScreen = () => {
    const {userProfile} = useAuth();

    const [visible, setVisible] = useState(false);
    const [requestList, setRequestList] = useState([]);
    const [filteredList, setFilteredList] = useState([])

    const [currentList, setCurrentList] = useState([]);
    const [incommingList, setIncommingList] = useState([]);
    const [outgoingList, setOutgoingList] = useState([])

    const [tab, setTab] = useState("Outgoing");
    const [accepted, setAccepted] = useState(false);

    const handleAcceptRequest = (id) => {
      accepts_invitations(id, res => {
        if(res){
          if(tab == "Outgoing"){
            const temp  = currentList.filter(item => item._id == id);
            const temp2 = temp.map(item => {
              return {
                ...item,
                status: "accepted"
              }
            })
            setCurrentList(temp2);
            setOutgoingList(temp2);
          }else{
            const temp  = currentList.filter(item => item._id == id);
            const temp2 = temp.map(item => {
              return {
                ...item,
                status: "accepted"
              }
            })
            setCurrentList(temp2);
            setIncommingList(temp2);
          }
          setAccepted(true);
        }
      })
    }

    const handleDelinkRequest = (id) => {
      cancels_invitations(id, res => {
        if(res){
          setCurrentList([]);
          setIncommingList([]);
          setOutgoingList([]);

          setAccepted(false);
        }
      })
    }

    const handleDeleteRequest = (id) => {
      delete_invitations(id, res => {
        if(res){
          if(tab == "Outgoing"){
            setCurrentList(currentList.filter(item => item._id != id));
            setOutgoingList(outgoingList.filter(item => item._id != id))
          }else{
            setCurrentList(currentList.filter(item => item._id != id));
            setIncommingList(incommingList.filter(item => item._id != id))
          }
          
        }
      })
    }


    const handleTab = (tb)=>{
      if(tb == "Outgoing"){
        setCurrentList(outgoingList)
      }else{
        setCurrentList(incommingList)
      }
      setTab(tb);
    }


    const handleGetRequestList = (accepted) => {
        setVisible(true);

        get_partners_request(res => {
            if(res){
                
                

                if(res?.data?.partnerRequest){
                  setCurrentList([{
                    _id: res?.data?.partnerRequest?._id,
                    email: res?.data?.partnerInfo?.email,
                    name: res?.data?.partnerInfo?.name,
                    relation: res?.data?.partnerRequest?.relation,
                    image: res?.data?.partnerInfo?.image,
                    status: 'accepted'
                  }])
                  setIncommingList([{
                    _id: res?.data?.partnerRequest?._id,
                    email: res?.data?.partnerInfo?.email,
                    name: res?.data?.partnerInfo?.name,
                    relation: res?.data?.partnerRequest?.relation,
                    image: res?.data?.partnerInfo?.image,
                    status: 'accepted'
                  }])
                  setOutgoingList([{
                    _id: res?.data?.partnerRequest?._id,
                    email: res?.data?.partnerInfo?.email,
                    name: res?.data?.partnerInfo?.name,
                    relation: res?.data?.partnerRequest?.relation,
                    image: res?.data?.partnerInfo?.image,
                    status: 'accepted'
                  }])
                }else{
                  setCurrentList(res?.data?.outgoing)
                  setIncommingList(res?.data?.incoming);
                  setOutgoingList(res?.data?.outgoing);
                }

                console.log(res.data);
            }else{
                setRequestList([])
            }

            setVisible(false);
        })
    }

    useEffect(() => {
        handleGetRequestList(accepted);
    }, [accepted])

    console.log(JSON.stringify(currentList, null,2 ))



  const renderRequest = ({ item }) => (
    <View className="bg-white mb-4 rounded-2xl p-4 flex-row items-center">
      {/* Avatar */}
      {item?.image ?
          <Image
              className="h-[30] w-[30] rounded-full"
              source={{uri:item?.image}}
          />:
          <View className="items-center rounded-full justify-center h-[40] w-[40] bg-slate-300">
              <User size={25}/>
          </View>
      }

      {/* User Info */}
      <View className="flex-1 ml-4">
        <Text className="text-black text-base font-bold mb-0.5">
          {item?.name}
        </Text>
        <Text className="text-gray-600 text-sm mb-0.5">
          {item?.relation}
        </Text>
        <Text className="text-gray-500 text-xs">
          {(tab == "Outgoing" && item?.status != "accepted")?item?.email:item?.senderEmail}
          {(item?.status == "accepted") && item?.email}
        </Text>
      </View>

      {/* Action Buttons */}
      {item?.status == "pending"?
        <View className="flex-row items-center ml-2">
        {/* Accept Button */}
        {!(tab == "Outgoing") && <TouchableOpacity 
          className="w-9 h-9 rounded-full bg-green-500 items-center justify-center mr-2"
          activeOpacity={0.8}
          onPress={() => handleAcceptRequest(item?._id)}
        >
          <Check size={20} color="#FFF" strokeWidth={3} />
        </TouchableOpacity>}

        {/* Reject Button */}
        {tab == "Outgoing" && <TouchableOpacity 
          className="w-9 h-9 rounded-full bg-red-500 items-center justify-center"
          activeOpacity={0.8}
          onPress={() => handleDeleteRequest(item?._id)}
        >
          <X size={20} color="#FFF" strokeWidth={3} />
        </TouchableOpacity>}

      </View>:

      <View className="flex-row items-center ml-2">

        <TouchableOpacity 
          className="w-16 h-8 bg-red-700 rounded-md items-center justify-center mr-2"
          activeOpacity={0.8}
          onPress={() => handleDelinkRequest(item?._id)}
        >
          <Text className="text-white font-archivo-semi-bold">Delink</Text>
        </TouchableOpacity>

      </View>
    
      }
    </View>
  );

  return (
    <ComponentWrapper bg_color='bg-[##5055ba]' title='Send Invitation'>
        {/* Header */}
      <View className="px-4 py-4  ">
        <Text className="text-black text-center text-xl font-bold">
          Partner Request
        </Text>
      </View>

      <View className="flex flex-row">
          <TouchableOpacity onPress={() => handleTab("Outgoing")} className={`${tab=="Outgoing"?"bg-[##5055ba]":"bg-[##5055ba80]"} px-5 py-3 rounded-sm`}>
            <Text className="font-archivo-semi-bold  text-white text-xl">Outgoing</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTab("Incoming")} className={`${tab=="Incoming"?"bg-[##5055ba]":"bg-[##5055ba80]"} px-5 py-3 rounded-sm ml-3`}>
            <Text className="font-archivo-semi-bold  text-white text-xl">Incoming</Text>
          </TouchableOpacity>
          
      </View>

      {/* Request List */}
      <FlatList
        data={currentList}
        renderItem={renderRequest}
        keyExtractor={(item, idx) => idx}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />


        {visible && <Indicator visible={visible} onClose={() => setVisible(false)}>

                <ActivityIndicator size={"large"}/>
            
            </Indicator>}
    </ComponentWrapper>
      
  );
};

export default PartnerRequestScreen;