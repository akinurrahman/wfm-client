// import React from 'react';

// import { Link } from 'react-router';

// import {
//     Breadcrumb,
//     BreadcrumbItem,
//     BreadcrumbLink,
//     BreadcrumbList,
//     BreadcrumbPage,
//     BreadcrumbSeparator,
// } from '@/components/ui/breadcrumb';
// import { useBreadcrumbStore } from '@/stores/breadcrumb';

// const BreadCrump = () => {
//     const breadcrumbs = useBreadcrumbStore(state => state.breadcrumbs);

//     return (
//         <Breadcrumb>
//             <BreadcrumbList>
//                 {breadcrumbs.map((item, idx) => (
//                     <React.Fragment key={idx}>
//                         <BreadcrumbItem>
//                             {item.url ? (
//                                 <BreadcrumbLink asChild>
//                                     <Link to={item.url}>{item.title}</Link>
//                                 </BreadcrumbLink>
//                             ) : (
//                                 <BreadcrumbPage>{item.title}</BreadcrumbPage>
//                             )}
//                         </BreadcrumbItem>
//                         {idx < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
//                     </React.Fragment>
//                 ))}
//             </BreadcrumbList>
//         </Breadcrumb>
//     );
// };

// export default BreadCrump;
