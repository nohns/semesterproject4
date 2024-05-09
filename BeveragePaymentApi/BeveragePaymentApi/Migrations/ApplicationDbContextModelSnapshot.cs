﻿// <auto-generated />
using System;
using BeveragePaymentApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace BeveragePaymentApi.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("BeveragePaymentApi.Domain.Beverage", b =>
                {
                    b.Property<int>("BeverageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<double>("BasePrice")
                        .HasColumnType("double");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.Property<string>("ImageSrc")
                        .HasColumnType("longtext");

                    b.Property<double>("MaxPrice")
                        .HasColumnType("double");

                    b.Property<double>("MinPrice")
                        .HasColumnType("double");

                    b.Property<string>("Name")
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.HasKey("BeverageId");

                    b.ToTable("Beverages");
                });

            modelBuilder.Entity("BeveragePaymentApi.Domain.Entities.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("PricingHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("BeverageId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("BeverageId")
                        .IsUnique();

                    b.ToTable("PricingHistories");
                });

            modelBuilder.Entity("PricingHistoryEntry", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<int>("Price")
                        .HasColumnType("int");

                    b.Property<int>("PricingHistoryId")
                        .HasColumnType("int");

                    b.Property<DateTime>("Timestamp")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("PricingHistoryId");

                    b.ToTable("PricingHistoryEntries");
                });

            modelBuilder.Entity("PricingHistory", b =>
                {
                    b.HasOne("BeveragePaymentApi.Domain.Beverage", "Beverage")
                        .WithOne("PricingHistory")
                        .HasForeignKey("PricingHistory", "BeverageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Beverage");
                });

            modelBuilder.Entity("PricingHistoryEntry", b =>
                {
                    b.HasOne("PricingHistory", "PricingHistory")
                        .WithMany("PricingHistoryEntries")
                        .HasForeignKey("PricingHistoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PricingHistory");
                });

            modelBuilder.Entity("BeveragePaymentApi.Domain.Beverage", b =>
                {
                    b.Navigation("PricingHistory");
                });

            modelBuilder.Entity("PricingHistory", b =>
                {
                    b.Navigation("PricingHistoryEntries");
                });
#pragma warning restore 612, 618
        }
    }
}
