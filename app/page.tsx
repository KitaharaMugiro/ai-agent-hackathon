import VoicebotPage from "@/components/VoicebotPage";



const Page = async () => {
  const client_id = "909a2dfd-e9e3-4e9a-89be-f650e5e972ba";
  return (
    <div className="bg-gradient-to-r">
      <VoicebotPage client_id={client_id} />
    </div>
  );
};

export default Page;
