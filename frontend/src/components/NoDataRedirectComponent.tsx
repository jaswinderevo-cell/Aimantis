import { Building2 } from "lucide-react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import { Link } from "react-router-dom";
import { AddStructureModal } from "./Modals/AddStructure";

type NoDataRedirectComponentProps = {
  heading: string;
  description: string;
  route: string;
  buttonText?: string;
  icon?: string;
};

const NoDataRedirectComponent = ({
  heading,
  description,
  route,
  buttonText,
  icon,
}: NoDataRedirectComponentProps) => {
  const [isStructureModalOpen, setIsStructureModalOpen] = useState(false);
  return (
    <>
      <div className="text-center py-20">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">{heading}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {icon === "add" ? (
          <>
            <div className="flex justify-center">
              <button
                onClick={() => setIsStructureModalOpen(true)}
                className="btn text-[15px] flex justify-between font-medium items-center gap-2 text-white text-center rounded-md py-2 hover:cursor-pointer px-4"
              >
                <FaPlus size={20} /> Add Structure
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <Link to={route}>
                <button className="btn text-[15px] flex justify-between font-medium items-center gap-2 text-white text-center rounded-md py-2 hover:cursor-pointer px-4">
                  <MdArrowBack size={20} />{" "}
                  {buttonText ? buttonText : "Go to Structure"}
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
      <AddStructureModal
        open={isStructureModalOpen}
        onOpenChange={setIsStructureModalOpen}
      />
    </>
  );
};

export default NoDataRedirectComponent;
