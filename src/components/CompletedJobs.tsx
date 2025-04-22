import { IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";
import empty from "/assets/empty.png";
import JobDetails from "./JobDetails";
import PayJobModal from "./PayJobModal";
import { Job } from "../types";

const CompletedJobs: React.FC = () => {
    const userInfoString = sessionStorage.getItem("userInfo");
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    const [jobs, setJobs] = useState<Job[]>([]);
    const [openDetails, setOpenDetails] = useState<boolean>(false);
    const [selectedJobDetails, setSelectedJobDetails] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);

    const [openPay, setOpenPay] = useState<boolean>(false);
    

    // Access properties with fallback in case userInfo is null
    const firstName = userInfo?.firstName || "Guest";
    const lastName = userInfo?.lastName || "";
    const userId = userInfo?.id || "";

    const endpoint = "http://localhost/hq2ClientApi/getJob.php";

    useEffect(() => {
        if (userId) {
            handleFetchJobs();
        }
    }, [userId]);

    const handleFetchJobs = async () => {
        const payload = { userId };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log("API Response:", data);

            if (data.status === "success" && data.jobDetails) {
                let jobList = [];

                // Ensure jobDetails is an array
                if (Array.isArray(data.jobDetails)) {
                    jobList = data.jobDetails;
                } else {
                    jobList = [data.jobDetails]; // Convert single object to an array
                }

                const completedJobs = Array.isArray(jobList)  
                ? jobList.filter((job: Job) => job.status === "completed" || job.status === "cancelled")  
                : [];
              

                setJobs(completedJobs);
            } else {
                console.error("Failed to retrieve job details:", data.message);
                setJobs([]); // Clear the job list if no jobs are found
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
            <div style={{marginTop: "1rem", border: "0px solid", overflow: "scroll"}}>
                {jobs.length > 0 ? (
                    <div style={{overflow: "scroll"}}>
                    {jobs.map((job: Job, index: number) => (
                            <div 
                                key={index} 
                                style={{
                                    // borderRadius: "10px", 
                                    padding: "7px", 
                                    background: "white", 
                                    marginTop: "10px"
                                }}
                            >
                                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                    <div 
                                        style={{
                                            fontSize: "18px", 
                                            fontWeight: "700", 
                                            overflow: "hidden", 
                                            color: "var(--ion-company-wood)", 
                                            width: "50%", 
                                            textOverflow: "ellipsis", 
                                            whiteSpace: "nowrap"
                                        }}
                                    >
                                        {job.skill}
                                    </div>
                                    <div 
                                        style={{
                                            color: job.status === "completed" ? "green" : "red", 
                                            fontSize: "14px",
                                            fontWeight: "700"
                                        }}
                                    >
                                        {job.status}
                                    </div>
                                </div>
                                <div style={{fontSize: "10px", marginTop: "4px"}}>
                                    {job.created_at}
                                </div>
                                <div 
                                    style={{
                                        marginTop: "5px", 
                                        borderTop: "1px solid #ccc", 
                                        paddingTop: "4px", 
                                        display: "flex", 
                                        justifyContent: "space-between", 
                                        alignItems: "center"
                                    }}
                                >
                                    <div style={{overflow: "hidden", width: "50%", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "13px"}}>
                                        {job.local_government}
                                    </div>
                                    <div 
                                        style={{
                                            fontSize: "13px", 
                                            cursor: "pointer", 
                                            color: "var(--ion-company-gold)"
                                        }}
                                        onClick={() => {
                                            if (job.status === 'pending approval') {
                                                setOpenPay(true);
                                                setSelectedJobDetails(job.id); // Set selected job ID
                                                setAmount(job.price);
                                            } else {
                                                setSelectedJobDetails(job.id); // Set selected job ID
                                                setOpenDetails(true); // Open modal
                                            }
                                        }}
                                    >
                                        {job.status === 'pending approval' ? 'Approve & Pay' : 'View details >>'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <div>
                            <img src={empty} />
                        </div>
                    <div style={{fontSize: "14px", color: "grey", textAlign: "center"}}>You currently have no completed job</div>
                    </div>
                )}
                <PayJobModal isOpen={openPay} onClose={()=>setOpenPay(false)} job={jobs} jobId={selectedJobDetails} amount={amount} userId={userId} />
            <JobDetails isJobModalOpen={openDetails} onClose={()=>setOpenDetails(false)} jobId={selectedJobDetails} />
            </div>
    );
};

export default CompletedJobs;
