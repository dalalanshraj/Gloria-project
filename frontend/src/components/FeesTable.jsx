import React from "react";

const FeesTable = () => {
  const fees = [
    {
      name: "BED TAXES",
      value: "5%",
      type: "Percent",
      option: "Mandatory",
    },
    {
      name: "SALES TAX",
      value: "7%",
      type: "Percent",
      option: "Mandatory",
    },
    {
      name: "CITY TAXES",
      value: "1%",
      type: "Percent",
      option: "Mandatory",
    },
    {
      name: "Deposit",
      value: "$300",
      type: "Fixed",
      option: "Mandatory",
    },
  ];

  return (
    <div className="w-full px-4 py-10">
      {/* <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Property Fees
      </h2> */}

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-[#2f9bad] text-white">
            <tr>
              <th className="py-3 px-4 text-left">Fee Name</th>
              <th className="py-3 px-4 text-left">Fee Value</th>
              <th className="py-3 px-4 text-left">Fee Type</th>
              <th className="py-3 px-4 text-left">Fee Option</th>
            </tr>
          </thead>

          <tbody>
            {fees.map((fee, index) => (
              <tr
                key={index}
                className="transition duration-300 hover:bg-blue-50 hover:scale-[1.01] cursor-pointer"
              >
                <td className="py-3 px-4 border-b">{fee.name}</td>
                <td className="py-3 px-4 border-b">{fee.value}</td>
                <td className="py-3 px-4 border-b">{fee.type}</td>
                <td className="py-3 px-4 border-b">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {fee.option}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeesTable;