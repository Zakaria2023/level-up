"use client";

import DataTable from "@/components/data/DataTable";
import DataTableAction from "@/components/data/DataTableAction";
import { useContactInformationTable } from "../../hooks/useContactInformationTable";

const contactInformationTableHeaders = [
  <span key="country">
    country
  </span>,
  <span key="city">
    city
  </span>,
  <span key="detailedAddress">
    detailedAddress
  </span>,
  <span key="primaryPhoneNumber">
    primaryPhoneNumber
  </span>,
  <span key="primaryEmail">
    primaryEmail
  </span>,
  <span key="website">
    website
  </span>,
  <span key="socialMediaLinks">
    socialMediaLinks
  </span>,
  <span key="actions">
    actions
  </span>,
];

const ContactInformationTable = () => {
  const {
    paginatedRows,
    deleteRow,
    searchValue,
    setSearchValue,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    filteredRows,
    currentPage,
  } = useContactInformationTable();

  return (
    <DataTable
      items={paginatedRows}
      getRowKey={(item) => item.id}
      gridColsClass="grid-cols-[180px_180px_minmax(280px,1.5fr)_200px_220px_220px_minmax(260px,1.5fr)_120px]"
      headers={contactInformationTableHeaders}
      pageHeading="Contact Information"
      addLinkHref="/settings/contact-information/new"
      addLinkLabel="Add Contact Information"
      enableSearch
      searchValue={searchValue}
      onSearchChange={(value) => {
        setSearchValue(value);
        setPage(0);
      }}
      searchPlaceholder="Search contact information"
      emptyText="No contact information rows match your search."
      headerActions={
        <div className="inline-flex h-10 items-center rounded-xl bg-(--primary-soft) px-4 text-sm font-semibold text-(--primary-strong)">
          {filteredRows.length} records
        </div>
      }
      renderRow={(item) => (
        <>
          <div>
            {item.country}
          </div>

          <div>
            {item.city}
          </div>

          <div>
            {item.detailedAddress}
          </div>

          <div>
            {item.primaryPhoneNumber}
          </div>

          <div>
            {item.primaryEmail}
          </div>

          <div>
            {item.website}
          </div>

          <div>
            {item.socialMediaLinks.slice(0, 20)}
            {item.socialMediaLinks.length > 20 && "..."}
          </div>

          <div className="flex w-full justify-center">
            <DataTableAction
              viewLink={`/settings/contact-information/${item.id}`}
              editLink={`/settings/contact-information/${item.id}/edit`}
              onDeleteConfirm={() => deleteRow(item.id)}
            />
          </div>
        </>
      )}
      pagination={{
        page: currentPage,
        setPage,
        totalPages,
        totalCount: filteredRows.length,
        pageSize,
        setPageSize,
      }}
    />
  );
};

export default ContactInformationTable;
