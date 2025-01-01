import PaginationTable, {
  TableDataType,
} from "@/components/ui/table/PaginationTable";
import { useEffect, useState } from "react";

function Tags() {
  const header = [
    { key: "name", child: "Name" },
    { key: "gender", child: "Gender" },
  ];

  const [data, setData] = useState([] as Array<TableDataType>);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      const getData = [
        {
          gender: "Michael",
          name: "Macdonald",
        },
        {
          gender: "Huff",
          name: "Velez",
        },
        {
          gender: "Dixie",
          name: "Mccormick",
        },
        {
          gender: "Cohen",
          name: "Hays",
        },
        {
          gender: "Irene",
          name: "Knowles",
        },
        {
          gender: "Knowles",
          name: "Bauer",
        },
        {
          gender: "Kristi",
          name: "Zimmerman",
        },
        {
          gender: "Ericka",
          name: "Garrison",
        },
        {
          gender: "Celeste",
          name: "Bennett",
        },
        {
          gender: "Odessa",
          name: "Hobbs",
        },
        {
          gender: "Tamera11",
          name: "Riley",
        },
        {
          gender: "Georgina",
          name: "Hunter",
        },
        {
          gender: "Alyson",
          name: "Merritt",
        },
        {
          gender: "Hayden",
          name: "Cook",
        },
        {
          gender: "Angel",
          name: "Logan",
        },
        {
          gender: "Davidson",
          name: "Fischer",
        },
        {
          gender: "Hudson",
          name: "Conley",
        },
        {
          gender: "Fox",
          name: "Franco",
        },
        {
          gender: "Sweeney",
          name: "Justice",
        },
        {
          gender: "Solomon",
          name: "Young",
        },
        {
          gender: "Patrica",
          name: "Duncan",
        },
        {
          gender: "Christine",
          name: "Mccoy",
        },
        {
          gender: "Cardenas",
          name: "Sims",
        },
        {
          gender: "Ollie",
          name: "Barnes",
        },
        {
          gender: "Gracie",
          name: "Cruz",
        },
        {
          gender: "Wendi",
          name: "Richardson",
        },
        {
          gender: "Wallace",
          name: "Wise",
        },
        {
          gender: "Cummings",
          name: "Kaufman",
        },
        {
          gender: "Mclean",
          name: "Owens",
        },
        {
          gender: "Ursula",
          name: "Hampton",
        },
        {
          gender: "Booker",
          name: "Grimes",
        },
        {
          gender: "Valencia",
          name: "Chambers",
        },
        {
          gender: "Dillon",
          name: "Neal",
        },
        {
          gender: "Pierce",
          name: "Moon",
        },
        {
          gender: "Silvia",
          name: "Lewis",
        },
        {
          gender: "Cleveland",
          name: "Joyner",
        },
        {
          gender: "Norton",
          name: "Thomas",
        },
        {
          gender: "Bartlett",
          name: "Romero",
        },
        {
          gender: "Pearl",
          name: "Holcomb",
        },
        {
          gender: "Vilma",
          name: "Holland",
        },
        {
          gender: "Farley",
          name: "Sweet",
        },
        {
          gender: "Norma",
          name: "James",
        },
        {
          gender: "Marcie",
          name: "Henry",
        },
        {
          gender: "Becky",
          name: "Pacheco",
        },
        {
          gender: "Higgins",
          name: "Preston",
        },
        {
          gender: "Corina",
          name: "Ferrell",
        },
        {
          gender: "Hampton",
          name: "Mcmillan",
        },
        {
          gender: "Leila",
          name: "Wooten",
        },
        {
          gender: "Vincent",
          name: "Reilly",
        },
        {
          gender: "Magdalena",
          name: "Ballard",
        },
        {
          gender: "Riddle",
          name: "Hudson",
        },
        {
          gender: "Jodie",
          name: "Wallace",
        },
        {
          gender: "Witt",
          name: "Pearson",
        },
        {
          gender: "Loretta",
          name: "Talley",
        },
        {
          gender: "Sykes",
          name: "Myers",
        },
        {
          gender: "Ada",
          name: "Jennings",
        },
        {
          gender: "Ethel",
          name: "Hardy",
        },
        {
          gender: "Navarro",
          name: "Sellers",
        },
        {
          gender: "Cole",
          name: "Hendrix",
        },
        {
          gender: "Yvonne",
          name: "Sanchez",
        },
        {
          gender: "Whitney",
          name: "Holman",
        },
        {
          gender: "Jewell",
          name: "Morin",
        },
        {
          gender: "Zamora",
          name: "Moses",
        },
        {
          gender: "Casey",
          name: "Wade",
        },
        {
          gender: "Holcomb",
          name: "Hawkins",
        },
        {
          gender: "Rae",
          name: "Glenn",
        },
        {
          gender: "Kennedy",
          name: "Deleon",
        },
        {
          gender: "Huber",
          name: "Acevedo",
        },
        {
          gender: "Dunn",
          name: "Hutchinson",
        },
        {
          gender: "Schmidt",
          name: "Rosario",
        },
        {
          gender: "Beatriz",
          name: "Frazier",
        },
        {
          gender: "Jimenez",
          name: "Berg",
        },
        {
          gender: "Rodriguez",
          name: "Hoover",
        },
        {
          gender: "Bauerfinal",
          name: "Odom",
        },
      ];

      setData(getData);
      setTotalItems(getData.length);
      //   setTotalItems(getData.length);
    }, 2000);
  }, []);

  return (
    <PaginationTable
      header={header}
      data={data}
      loading={false}
      initialPage={1}
      totalItems={totalItems}
      itemsPerPage={10}
      onPageChange={(page: number) => {
        setCurrentPage(page);
      }}
      serverPagination={false}
    ></PaginationTable>
  );
}

export default Tags;
