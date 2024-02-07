// import React from "react";
// import { BsPencilSquare } from "react-icons/bs";
// import { MdDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";

// const ReadOnlyRow = ({ item , handleEditClick}) => {
//   return (
//     <tr className="odd:bg-[#0d343e] even:bg-[#0d3e43]" key={item.employee_id}>
//       <td className="border-[1px] border-black text-white p-2">
//         {item.employee_id}
//       </td>
//       <td className="border-[1px] border-black text-white p-2">
//         {item.employee_code}
//       </td>
//       <td className="border-[1px] border-black text-white p-2">
//         {item.employee_name}
//       </td>
//       <td className="border-[1px] border-black text-white p-2">
//         {item.country_name}
//       </td>
//       <td className="border-[1px] border-black text-white p-2">
//         <div className="flex justify-evenly">
//           <button className="p-1 bg-blue-500 hover:bg-blue-400 text-white rounded-md">
//             <MdOutlineRemoveRedEye size={20} />
//           </button>
//           <button 
//           className="p-2 bg-green-500 hover:bg-green-400 text-white rounded-md"
//           onClick={(e) => handleEditClick(e , item)}
//           >
//             <BsPencilSquare size={15} />
//           </button>
//           <button className="p-1 bg-red-500 hover:bg-red-400 text-white rounded-md">
//             <MdDeleteOutline size={20} />
//           </button>
//         </div>
//       </td>
//     </tr>
//   );
// };

// export default ReadOnlyRow;
